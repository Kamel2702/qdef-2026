import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

let cachedUrl = null;
let fetched = false;

export default function TicketLink({ className, style, children }) {
  const [url, setUrl] = useState(cachedUrl);

  useEffect(() => {
    if (fetched) return;
    fetched = true;
    fetch('/api/config')
      .then(r => r.ok ? r.json() : {})
      .then(c => { cachedUrl = c.ticket_url || null; setUrl(cachedUrl); })
      .catch(() => {});
  }, []);

  if (url) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className={className} style={style}>{children}</a>;
  }
  return <Link to="/register" className={className} style={style}>{children}</Link>;
}
