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

    // Send notification email to Isaac
    const notificationEmail = {
      from: 'notifications@isaacbenyakar.com',
      to: 'iby@isaacbenyakar.com',
      reply_to: email,
      subject: `🚀 New Lead: ${name} ${projectType ? `(${projectType})` : ''} - ${budget ? budget.replace(/k/g, 'K') : 'Budget TBD'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
            .lead-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6; }
            .field { margin: 15px 0; }
            .field-label { font-weight: 600; color: #374151; margin-bottom: 5px; }
            .field-value { background: white; padding: 12px; border-radius: 6px; border: 1px solid #d1d5db; }
            .message-box { background: #fefefe; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
            .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            .priority-high { background: #fee2e2; color: #dc2626; }
            .priority-medium { background: #fef3c7; color: #d97706; }
            .priority-low { background: #ecfdf5; color: #059669; }
            .cta { background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚀 New Lead Alert!</h1>
            <p>Someone is interested in working with you</p>
          </div>
          
          <div class="content">
            <div class="lead-info">
              <h2 style="margin-top: 0; color: #1f2937;">
                ${name}
                ${(() => {
                  if (!budget) return '<span class="priority priority-medium">Budget TBD</span>';
                  if (budget.includes('50k+')) return '<span class="priority priority-high">High Value</span>';
                  if (budget.includes('30k-50k') || budget.includes('15k-30k')) return '<span class="priority priority-medium">Mid-Range</span>';
                  return '<span class="priority priority-low">Starter</span>';
                })()}
              </h2>
              
              <div class="field">
                <div class="field-label">📧 Email</div>
                <div class="field-value">${email}</div>
              </div>
              
              ${company ? `
              <div class="field">
                <div class="field-label">🏢 Company</div>
                <div class="field-value">${company}</div>
              </div>
              ` : ''}
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                <div class="field">
                  <div class="field-label">🎯 Project Type</div>
                  <div class="field-value">${projectType || 'Not specified'}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">💰 Budget</div>
                  <div class="field-value">${budget ? '$' + budget.replace(/k/g, 'K') : 'To be discussed'}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">⏰ Timeline</div>
                  <div class="field-value">${timeline || 'Flexible'}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">📅 Submitted</div>
                  <div class="field-value">${new Date().toLocaleString('en-US', { 
                    timeZone: 'America/New_York',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })} EST</div>
                </div>
              </div>
            </div>
            
            <div class="field">
              <div class="field-label">💬 Project Details</div>
              <div class="message-box">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${email}?subject=Re: Your Project Inquiry&body=Hi ${name},%0A%0AThank you for reaching out about your project. I'd love to discuss this further with you.%0A%0AWhen would be a good time for a quick 15-minute call this week?%0A%0ABest regards,%0AIsaac Benyakar" class="cta">
                📧 Reply to ${name}
              </a>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
              <h3 style="margin-top: 0; color: #1e40af;">💡 Quick Response Tips:</h3>
              <ul style="color: #374151; margin: 0;">
                <li><strong>Respond within 2 hours</strong> for best conversion rates</li>
                <li><strong>Reference their specific project type</strong> in your response</li>
                <li><strong>Suggest a quick call</strong> rather than long email exchanges</li>
                <li><strong>Share a relevant case study</strong> if you have one</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>💻 Sent from your isaacbenyakar.com contact form</p>
            <p>This email was automatically generated when ${name} submitted the contact form.</p>
          </div>
        </body>
        </html>
      `,
      text: `
🚀 NEW LEAD ALERT!

${name} just submitted a contact form on isaacbenyakar.com

CONTACT DETAILS:
==================
Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Project Type: ${projectType || 'Not specified'}
Budget Range: ${budget || 'To be discussed'}
Timeline: ${timeline || 'Flexible'}
Submitted: ${new Date().toLocaleString('en-US', { 
  timeZone: 'America/New_York',
  month: 'short',
  day: 'numeric', 
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
})} EST

PROJECT DETAILS:
==================
${message}

QUICK RESPONSE TIPS:
==================
- Respond within 2 hours for best conversion
- Reference their specific project type
- Suggest a quick call vs long emails
- Share a relevant case study

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
      body: JSON.stringify(notificationEmail)
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