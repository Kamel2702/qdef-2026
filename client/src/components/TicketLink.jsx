import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

export default function TicketLink({ className, style, children }) {
  const config = useConfig();

  if (config.ticket_url) {
    return <a href={config.ticket_url} target="_blank" rel="noopener noreferrer" className={className} style={style}>{children}</a>;
  }
  return <Link to="/register" className={className} style={style}>{children}</Link>;
}
