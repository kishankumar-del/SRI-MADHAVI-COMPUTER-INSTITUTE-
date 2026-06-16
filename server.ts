import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  initDb, 
  getDb, 
  updateDb, 
  hashPassword, 
  Course, 
  Application, 
  Certificate, 
  Inquiry 
} from './server/db.ts';

// Initialize our local/file database system
initDb();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON payloads. Limit to 10mb for base64 file uploads (photo / id proofs)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to generate IDs
function generateId() {
  return Math.random().toString(36).substring(2, 11).toUpperCase();
}

// ----------------------------------------------------
// AUTHENTICATION MIDDLEWARE
// ----------------------------------------------------
const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    return;
  }
  const token = authHeader.split(' ')[1];
  
  // Let's check token validity
  // Token format: "admin-session-<id>-<email>-<timestamp>"
  if (!token.startsWith('admin-session-')) {
    res.status(401).json({ error: 'Unauthorized: Token signature is invalid' });
    return;
  }

  // Token is valid for admin ops in this applet context
  next();
};

// ----------------------------------------------------
// PUBLIC & PRIV REST ENDPOINTS
// ----------------------------------------------------

// 1. Auth Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const db = getDb();
  const matchedAdmin = db.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  
  if (!matchedAdmin) {
    res.status(400).json({ error: 'Invalid email or password' });
    return;
  }

  const payloadHash = hashPassword(password);
  if (matchedAdmin.passwordHash !== payloadHash) {
    res.status(400).json({ error: 'Invalid email or password' });
    return;
  }

  // Generate a stateless backend token that lasts for the current active sandbox
  const timestamp = Date.now();
  const token = `admin-session-${matchedAdmin.id}-${Buffer.from(matchedAdmin.email).toString('base64')}-${timestamp}`;

  res.json({
    success: true,
    token,
    user: {
      id: matchedAdmin.id,
      name: matchedAdmin.name,
      email: matchedAdmin.email,
      role: matchedAdmin.role
    }
  });
});

// 2. Courses API
// Get all courses (public)
app.get('/api/courses', (req, res) => {
  try {
    const db = getDb();
    res.json(db.courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Add Course (admin)
app.post('/api/courses', authenticateAdmin, (req, res) => {
  const { title, description, duration, level, image, syllabus, learningOutcomes, prerequisites } = req.body;
  if (!title || !description || !duration || !level) {
    res.status(400).json({ error: 'Title, description, duration, and skill level are required' });
    return;
  }

  const newCourse: Course = {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `course-${generateId()}`,
    title,
    description,
    duration,
    level,
    image: image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    syllabus: syllabus || '',
    learningOutcomes: learningOutcomes || '',
    prerequisites: prerequisites || 'Open to all students'
  };

  updateDb((db) => {
    // Avoid duplicates
    const index = db.courses.findIndex(c => c.id === newCourse.id);
    if (index !== -1) {
      newCourse.id = `${newCourse.id}-${Math.floor(Math.random() * 1000)}`;
    }
    db.courses.push(newCourse);
  });

  res.status(201).json(newCourse);
});

// Update Course (admin)
app.put('/api/courses/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description, duration, level, image, syllabus, learningOutcomes, prerequisites } = req.body;

  let updatedCourse: Course | null = null;

  updateDb((db) => {
    const idx = db.courses.findIndex(c => c.id === id);
    if (idx !== -1) {
      db.courses[idx] = {
        ...db.courses[idx],
        title: title || db.courses[idx].title,
        description: description || db.courses[idx].description,
        duration: duration || db.courses[idx].duration,
        level: level || db.courses[idx].level,
        image: image || db.courses[idx].image,
        syllabus: syllabus !== undefined ? syllabus : db.courses[idx].syllabus,
        learningOutcomes: learningOutcomes !== undefined ? learningOutcomes : db.courses[idx].learningOutcomes,
        prerequisites: prerequisites !== undefined ? prerequisites : db.courses[idx].prerequisites,
      };
      updatedCourse = db.courses[idx];
    }
  });

  if (!updatedCourse) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  res.json(updatedCourse);
});

// Delete Course (admin)
app.delete('/api/courses/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  let deleted = false;

  updateDb((db) => {
    const idx = db.courses.findIndex(c => c.id === id);
    if (idx !== -1) {
      db.courses.splice(idx, 1);
      deleted = true;
    }
  });

  if (!deleted) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  res.json({ success: true, message: 'Course deleted successfully' });
});


// 3. Admissions Applications API
// Get all applications (admin)
app.get('/api/applications', authenticateAdmin, (req, res) => {
  try {
    const db = getDb();
    res.json(db.applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

// Submit Application (public)
app.post('/api/applications/apply', (req, res) => {
  const {
    studentName, fatherName, motherName, dob, gender,
    mobile, altMobile, email, address, city, state, pinCode,
    qualification, collegeName, percentage, course,
    studentPhoto, idProof
  } = req.body;

  if (!studentName || !fatherName || !motherName || !dob || !gender || !mobile || !email || !course) {
    res.status(400).json({ error: 'Please submit all required applicant particulars' });
    return;
  }

  // Generate unique ID like NCC-2026-X
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digits
  const applicationId = `NCC-2026-${randomSuffix}`;

  const newApp: Application = {
    applicationId,
    studentName,
    fatherName,
    motherName,
    dob,
    gender,
    mobile,
    altMobile: altMobile || '',
    email,
    address: address || '',
    city: city || '',
    state: state || '',
    pinCode: pinCode || '',
    qualification: qualification || '',
    collegeName: collegeName || '',
    percentage: percentage || '',
    course,
    studentPhoto: studentPhoto || '', // Base64 string
    idProof: idProof || '', // Base64 string
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  updateDb((db) => {
    db.applications.push(newApp);
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    applicationId,
    application: newApp
  });
});

// Search Application Status (public)
app.get('/api/applications/status', (req, res) => {
  const { query } = req.query; // query can be ApplicationID or Mobile Number
  if (!query) {
    res.status(400).json({ error: 'Please provide an Application ID or Registered Mobile number' });
    return;
  }

  const db = getDb();
  const searchStr = String(query).trim().toLowerCase();

  const found = db.applications.filter(app => 
    app.applicationId.toLowerCase() === searchStr || 
    app.mobile.replace(/\s+/g, '') === searchStr.replace(/\s+/g, '')
  );

  if (!found || found.length === 0) {
    res.status(404).json({ error: 'No matching application record found' });
    return;
  }

  // Return non-sensitive search layout
  res.json(found.map(app => ({
    applicationId: app.applicationId,
    studentName: app.studentName,
    course: app.course,
    status: app.status,
    createdAt: app.createdAt
  })));
});

// Update Application Details / Status (admin)
app.put('/api/applications/:applicationId', authenticateAdmin, (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body; // Approved, Rejected

  if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
    res.status(400).json({ error: 'Invalid application status option' });
    return;
  }

  let updatedApp: Application | null = null;

  updateDb((db) => {
    const idx = db.applications.findIndex(app => app.applicationId === applicationId);
    if (idx !== -1) {
      db.applications[idx].status = status;
      updatedApp = db.applications[idx];
    }
  });

  if (!updatedApp) {
    res.status(404).json({ error: 'Application records not found' });
    return;
  }

  res.json(updatedApp);
});

// Delete Application Record (admin)
app.delete('/api/applications/:applicationId', authenticateAdmin, (req, res) => {
  const { applicationId } = req.params;
  let deleted = false;

  updateDb((db) => {
    const idx = db.applications.findIndex(app => app.applicationId === applicationId);
    if (idx !== -1) {
      db.applications.splice(idx, 1);
      deleted = true;
    }
  });

  if (!deleted) {
    res.status(404).json({ error: 'Application record not found' });
    return;
  }

  res.json({ success: true, message: 'Application deleted from records successfully' });
});


// 4. Certificates API
// Get all certificates (admin)
app.get('/api/certificates', authenticateAdmin, (req, res) => {
  try {
    const db = getDb();
    res.json(db.certificates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to access certificate vaults' });
  }
});

// Verify & Download Certificate (public)
app.get('/api/certificates/verify', (req, res) => {
  const { rollNumber, dob } = req.query;
  
  if (!rollNumber || !dob) {
    res.status(400).json({ error: 'Roll number and Date of Birth are mandatory fields' });
    return;
  }

  const db = getDb();
  const rNum = String(rollNumber).trim().toUpperCase();
  const birthStr = String(dob).trim(); // YYYY-MM-DD

  const found = db.certificates.find(c => 
    c.rollNumber.toUpperCase() === rNum && 
    c.dob === birthStr
  );

  if (!found) {
    res.status(404).json({ error: 'Certificate match not found with specified Roll Number & Birth Date' });
    return;
  }

  res.json(found);
});

// Add Certificate Record (admin)
app.post('/api/certificates', authenticateAdmin, (req, res) => {
  const { rollNumber, studentName, course, dob, completionDate, certificateFile } = req.body;
  if (!rollNumber || !studentName || !course || !dob || !completionDate) {
    res.status(400).json({ error: 'Roll number, Student name, Course, DOB, and Completion Date are required' });
    return;
  }

  const randomCertId = `NCC-CERT-${Math.floor(100000 + Math.random() * 900000)}`;

  const newCert: Certificate = {
    certificateId: randomCertId,
    rollNumber: rollNumber.trim().toUpperCase(),
    studentName,
    course,
    dob,
    completionDate,
    certificateFile: certificateFile || ''
  };

  updateDb((db) => {
    // Avoid duplicate roll numbers
    const idx = db.certificates.findIndex(c => c.rollNumber === newCert.rollNumber);
    if (idx !== -1) {
      db.certificates[idx] = newCert; // Overwrite
    } else {
      db.certificates.push(newCert);
    }
  });

  res.status(201).json(newCert);
});

// Edit Certificate Record (admin)
app.put('/api/certificates/:certificateId', authenticateAdmin, (req, res) => {
  const { certificateId } = req.params;
  const { rollNumber, studentName, course, dob, completionDate, certificateFile } = req.body;

  let updatedCert: Certificate | null = null;

  updateDb((db) => {
    const idx = db.certificates.findIndex(c => c.certificateId === certificateId);
    if (idx !== -1) {
      db.certificates[idx] = {
        ...db.certificates[idx],
        rollNumber: rollNumber !== undefined ? rollNumber.trim().toUpperCase() : db.certificates[idx].rollNumber,
        studentName: studentName || db.certificates[idx].studentName,
        course: course || db.certificates[idx].course,
        dob: dob || db.certificates[idx].dob,
        completionDate: completionDate || db.certificates[idx].completionDate,
        certificateFile: certificateFile !== undefined ? certificateFile : db.certificates[idx].certificateFile
      };
      updatedCert = db.certificates[idx];
    }
  });

  if (!updatedCert) {
    res.status(404).json({ error: 'Certificate record not found' });
    return;
  }

  res.json(updatedCert);
});

// Delete Certificate (admin)
app.delete('/api/certificates/:certificateId', authenticateAdmin, (req, res) => {
  const { certificateId } = req.params;
  let deleted = false;

  updateDb((db) => {
    const idx = db.certificates.findIndex(c => c.certificateId === certificateId);
    if (idx !== -1) {
      db.certificates.splice(idx, 1);
      deleted = true;
    }
  });

  if (!deleted) {
    res.status(404).json({ error: 'Certificate file not found' });
    return;
  }

  res.json({ success: true, message: 'Certificate removed successfully' });
});


// 6. Contact Inquiries API
// Submit Contact Inquiry (public)
app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message content are required' });
    return;
  }

  const newInq: Inquiry = {
    id: `inq-${generateId()}`,
    name,
    email,
    phone: phone || '',
    message,
    status: 'Unread',
    createdAt: new Date().toISOString()
  };

  updateDb((db) => {
    db.inquiries.push(newInq);
  });

  res.status(201).json({ success: true, message: 'Message sent successfully. Our team will contact you shortly!' });
});

// Get all inquiries (admin)
app.get('/api/inquiries', authenticateAdmin, (req, res) => {
  try {
    const db = getDb();
    res.json(db.inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark Resolved (admin)
app.put('/api/inquiries/:id/resolve', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  let updatedInq: Inquiry | null = null;

  updateDb((db) => {
    const idx = db.inquiries.findIndex(inq => inq.id === id);
    if (idx !== -1) {
      db.inquiries[idx].status = 'Resolved';
      updatedInq = db.inquiries[idx];
    }
  });

  if (!updatedInq) {
    res.status(404).json({ error: 'Inquiry record not found' });
    return;
  }

  res.json(updatedInq);
});

// Delete Message (admin)
app.delete('/api/inquiries/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  let deleted = false;

  updateDb((db) => {
    const idx = db.inquiries.findIndex(inq => inq.id === id);
    if (idx !== -1) {
      db.inquiries.splice(idx, 1);
      deleted = true;
    }
  });

  if (!deleted) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }

  res.json({ success: true, message: 'Message deleted successfully' });
});

// Get dashboard statistics (admin)
app.get('/api/dashboard/stats', authenticateAdmin, (req, res) => {
  try {
    const db = getDb();
    res.json({
      totalCourses: db.courses.length,
      totalApplications: db.applications.length,
      totalCertificates: db.certificates.length,
      totalInquiries: db.inquiries.length,
      recentActivities: [
        ...db.applications.slice(-3).map(app => ({
          type: 'Admission Application',
          title: `New application by ${app.studentName}`,
          time: app.createdAt,
          status: app.status
        })),
        ...db.inquiries.slice(-2).map(inq => ({
          type: 'Contact Inquiry',
          title: `Inquiry from ${inq.name}`,
          time: inq.createdAt,
          status: inq.status
        }))
      ].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to pack statistical details' });
  }
});


// ----------------------------------------------------
// VITE DEV SERVER OR PROD STATIC SERVING
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== "production") {
    // DEV MODE: Integrate Vite's Dev Server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // PRODUCTION MODE: Serve static folder dist/
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => { // Express v5 wildcard path formulation
      res.sendFile(path.join(distPath, 'index.html'));
    });
    // Fallback support for v4 wildcard in case the user's environment handles v4 patterns
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server launched and running on http://localhost:${PORT}`);
  });
}

start();
