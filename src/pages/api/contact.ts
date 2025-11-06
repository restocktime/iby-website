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

    // Send email using Resend API
    const emailData = {
      from: 'website@isaacbenyakar.com',
      to: 'iby@isaacbenyakar.com',
      reply_to: email,
      subject: `New Contact Form - ${name} ${projectType ? `(${projectType})` : ''}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> isaacbenyakar.com contact form</p>
        <hr>
        
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Project Type:</strong> ${projectType || 'Not provided'}</p>
        <p><strong>Budget Range:</strong> ${budget || 'Not provided'}</p>
        <p><strong>Timeline:</strong> ${timeline || 'Not provided'}</p>
        
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p><small>Reply directly to this email to respond to ${name}.</small></p>
      `,
      text: `
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
Reply directly to this email to respond to ${name}.
      `.trim()
    };

    // Send email via Resend API
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      // Fallback to success page without sending email
      const successUrl = `/contact-success?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
      return new Response(null, {
        status: 302,
        headers: { 'Location': successUrl }
      });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      throw new Error('Failed to send email');
    }

    const result = await response.json();
    console.log('Email sent successfully:', result.id);

    // Redirect to success page
    const successUrl = `/contact-success?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': successUrl
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Even if email fails, redirect to success page so user doesn't see error
    const formData = await request.formData();
    const name = formData.get('name')?.toString() || 'there';
    const email = formData.get('email')?.toString() || '';
    const successUrl = `/contact-success?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&error=true`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': successUrl
      }
    });
  }
};