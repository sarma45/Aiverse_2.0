import { Request, Response } from 'express';
import Tool from '../models/Tool.js';

export const getSitemap = async (req: Request, res: Response) => {
  try {
    const tools = await Tool.find({ isVerified: true }).select('_id updatedAt');
    
    const baseUrl = process.env.CLIENT_URL || 'https://aiverse.com';
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Static pages
    xml += `  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/login</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/register</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>\n`;
    
    // Dynamic tool pages
    tools.forEach(tool => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/tool/${tool._id}</loc>\n`;
      xml += `    <lastmod>${(tool as any).updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
};
