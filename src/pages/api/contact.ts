export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const company = formData.get('company')?.toString() || '';
    const projectType = formData.get('project-type')?.toString() || '';
    const budget = formData.get('budget')?.toString() || '';
    const timeline = formData.get('timeline')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    // Basic validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Name, email, and message are required.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create email content
    const emailContent = `
New Contact Form Submission from isaacbenyakar.com

Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Project Type: ${projectType || 'Not provided'}
Budget Range: ${budget || 'Not provided'}
Timeline: ${timeline || 'Not provided'}

Message:
${message}

---
This message was sent from your website contact form.
Reply directly to this email to respond to ${name}.
    `.trim();

    // For now, we'll use a simple approach - in production you'd want to use a service like:
    // - SendGrid
    // - Nodemailer with SMTP
    // - Resend
    // - EmailJS
    
    // Since this is a static site, we'll redirect to a success page with the data
    // and provide instructions for the user to email directly
    
    const successUrl = `/contact-success?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': successUrl
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An error occurred. Please try again.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};