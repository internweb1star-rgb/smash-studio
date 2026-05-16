import nodemailer from 'nodemailer';
import Contact from '../models/Contact.js';

export const submitContact = async (req, res) => {

    try {

        const {
            name,
            organization,
            email,
            domain,
            message,
        } = req.body;

        if (!name || !organization || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        const newContact = await Contact.create({
            name,
            organization,
            email,
            domain,
            message,
        });

        // 2. SEND NOTIFICATION EMAILS (NON-BLOCKING)
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // Email to Admin
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL,
                subject: 'New Smash Studio Lead — ' + organization,
                html: `
            <div style="font-family:sans-serif;padding:20px;color:#0f172a;">
              <h2 style="color:#1B4FB8;">New Lead Captured</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Organization:</strong> ${organization}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Domain:</strong> ${domain || 'N/A'}</p>
              <p><strong>Message:</strong></p>
              <div style="background:#f1f5f9;padding:15px;border-radius:8px;">${message}</div>
              <p style="font-size:12px;color:#64748b;margin-top:20px;">System Timestamp: ${new Date().toISOString()}</p>
            </div>
          `,
            });

            // Auto-reply to User
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Transmission Received — Smash Studio',
                html: `
            <div style="font-family:sans-serif;padding:30px;background:#f7fafc;color:#0f172a;max-width:600px;margin:auto;border-radius:12px;border:1px solid #e2e8f0;">
              <h2 style="color:#1B4FB8;font-size:24px;margin-bottom:20px;">Transmission Confirmed</h2>
              <p>Hello ${name},</p>
              <p>We have successfully received your request for system deployment. Our engineering team is currently reviewing your requirements.</p>
              <p style="background:#edf2f7;padding:15px;border-left:4px solid #35A8F2;font-style:italic;">"${message}"</p>
              <p>A secure line will be opened shortly. Stay synchronized.</p>
              <br>
              <hr style="border:none;border-top:1px solid #e2e8f0;">
              <p style="font-size:12px;color:#64748B;">Smash Studio — Powering the National Network.</p>
            </div>
          `,
            });
        } catch (emailError) {
            console.error('Email notification failed but inquiry was saved:', emailError.message);
            // We don't throw here so the user still gets a success response
        }

        res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            data: newContact,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

/**
 * Get all inquiries (Admin)
 */
export const getAllInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } }
      ];
    }

    const inquiries = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Contact.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        inquiries,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalInquiries: count
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update inquiry status (Admin)
 */
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const inquiry = await Contact.findByIdAndUpdate(id, { 
      status, 
      adminNotes 
    }, { new: true });

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({
      status: 'success',
      data: { inquiry }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get Analytics Data (Admin)
 */
export const getAnalytics = async (req, res) => {
  try {
    const totalInquiries = await Contact.countDocuments();
    const newInquiries = await Contact.countDocuments({ status: 'New' });
    
    // Last 7 days leads
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLeads = await Contact.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      status: 'success',
      data: {
        totalInquiries,
        newInquiries,
        recentLeads
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete inquiry (Admin)
 */
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Contact.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({
      status: 'success',
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};