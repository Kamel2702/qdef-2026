import { useConfig } from '../context/ConfigContext';

export default function VenuePage() {
  const config = useConfig();
  const venueName = config.event_location || 'Maison du Savoir';
  const venueAddress = config.event_address || '2, avenue de l\'Université, 4365 Esch-sur-Alzette, Grand Duchy of Luxembourg';

  return (
    <>
      <section className="page-hero page-hero--img" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)'
      }}>
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1 className="page-hero__title">
            <span className="gradient-text">Venue</span>
          </h1>
          <p className="page-hero__subtitle">{venueName}</p>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          {/* Map */}
          <div className="venue-map" style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '3rem' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2590.5!2d5.9476!3d49.5018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47eaca5b7e37a73f%3A0x43e027b3a9f0ed0e!2sMaison+du+Savoir!5e0!3m2!1sen!2slu!4v1700000000000!5m2!1sen!2slu"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Maison du Savoir Location"
              style={{ width: '100%', height: '400px', border: 'none' }}
            />
          </div>

          {/* Two columns */}
          <div className="about-preview" style={{ marginBottom: '3rem' }}>
            <div className="about-preview__text">
              <h2>About the <span className="gradient-text">Venue</span></h2>
              <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.8, marginBottom: '1rem' }}>
                {config.venue_description_1 || `The ${venueName} is part of the University of Luxembourg's Belval campus in Esch-sur-Alzette. This modern, state-of-the-art building offers world-class conference facilities in the heart of Luxembourg's innovation district.`}
              </p>
              <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.8 }}>
                {config.venue_description_2 || `Built on the site of former steelworks, Belval represents Luxembourg's transformation from industrial heritage to a hub of research, technology, and innovation — the perfect setting for Q-DEF's quantum cyberdefense summit.`}
              </p>
              <div className="glass-card" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
                <strong style={{ color: 'var(--color-cyan)' }}>Address:</strong><br />
                <span style={{ color: 'var(--color-gray-500)' }}>
                  {venueAddress.split(',').map((part, i) => <span key={i}>{part.trim()}{i < venueAddress.split(',').length - 1 && <br />}</span>)}
                </span>
              </div>
            </div>
            <div className="about-preview__image">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="Maison du Savoir"
                loading="lazy"
              />
            </div>
          </div>

          {/* Info cards */}
          <div className="venue-info-grid">
            <div className="glass-card venue-info-card">
              <h3 style={{ color: 'var(--color-gray-800)' }}>By Air</h3>
              <p style={{ color: 'var(--color-gray-500)' }}>
                Luxembourg Findel Airport (LUX) is 25 km from Esch-sur-Alzette.
                Take the bus to Luxembourg Gare Centrale, then a train to Esch/Belval-Universit&eacute; station.
                All public transport in Luxembourg is free.
              </p>
            </div>
            <div className="glass-card venue-info-card">
              <h3 style={{ color: 'var(--color-gray-800)' }}>By Train</h3>
              <p style={{ color: 'var(--color-gray-500)' }}>
                Belval-Universit&eacute; station is a 5-minute walk from the Maison du Savoir.
                Regular trains run from Luxembourg Gare Centrale (20 min) and from Metz, France (45 min).
              </p>
            </div>
            <div className="glass-card venue-info-card">
              <h3 style={{ color: 'var(--color-gray-800)' }}>Parking</h3>
              <p style={{ color: 'var(--color-gray-500)' }}>
                Free public parking is available at the Belval campus. The P+R Belval
                car park is directly adjacent to the venue. GPS: 49.5018°N, 5.9476°E.
              </p>
            </div>
            <div className="glass-card venue-info-card">
              <h3 style={{ color: 'var(--color-gray-800)' }}>Hotels Nearby</h3>
              <ul style={{ color: 'var(--color-gray-500)', listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.3rem 0' }}>Ibis Esch Belval (5 min walk)</li>
                <li style={{ padding: '0.3rem 0' }}>Hotel & Spa & Restaurant & Residence & Camping (10 min)</li>
                <li style={{ padding: '0.3rem 0' }}>Hotels in Luxembourg City (20 min by train)</li>
              </ul>
            </div>
            <div className="glass-card venue-info-card">
              <h3 style={{ color: 'var(--color-gray-800)' }}>Accessibility</h3>
              <p style={{ color: 'var(--color-gray-500)' }}>
                The Maison du Savoir is fully accessible with wheelchair-accessible entrances,
                elevators, and adapted restrooms. Please indicate accessibility needs during registration.
              </p>
            </div>
            <div className="glass-card venue-info-card">
              <h3 style={{ color: 'var(--color-gray-800)' }}>On the Day</h3>
              <p style={{ color: 'var(--color-gray-500)' }}>
                Registration opens at 08:00. Badges, programmes, and Wi-Fi credentials at the welcome desk.
                Lunch and refreshments are included. Cloakroom service available.
              </p>
            </div>
          </div>

          {/* Hotels Section */}
          <div style={{ marginTop: '4rem' }}>
            <span className="label-tag" style={{ color: 'var(--color-accent)' }}>Accommodation</span>
            <h2 style={{ marginBottom: '0.5rem' }}>Hotels nearby.</h2>
            <p style={{ color: 'var(--color-gray-400)', marginBottom: '2rem' }}>
              Recommended hotels near Maison du Savoir, Esch-sur-Alzette.
            </p>
            <div className="hotels-grid">
              {[
                { name: 'Ibis Budget Esch Belval', distance: '5 min walk', price: 'From 75\u20AC/night', address: '12 Avenue du Rock\'n\'Roll, Esch-sur-Alzette', stars: 2, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80' },
                { name: 'Melia Luxembourg', distance: '20 min by train', price: 'From 160\u20AC/night', address: '1 Park Drai Eechelen, Luxembourg City', stars: 4, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80' },
                { name: 'Hotel Acacia Esch', distance: '10 min walk', price: 'From 95\u20AC/night', address: '10 Rue de la Libération, Esch-sur-Alzette', stars: 3, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80' },
                { name: 'Novotel Luxembourg Kirchberg', distance: '25 min by train', price: 'From 140\u20AC/night', address: '6 Rue Fort Niedergrünewald, Luxembourg', stars: 4, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80' },
                { name: 'Hotel & Restaurant TopTal', distance: '8 min by car', price: 'From 85\u20AC/night', address: 'Route de Belval, Sanem', stars: 3, img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=80' },
                { name: 'Sofitel Luxembourg Le Grand Ducal', distance: '25 min by train', price: 'From 220\u20AC/night', address: '40 Boulevard d\'Avranches, Luxembourg', stars: 5, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80' },
              ].map((hotel, i) => (
                <div className="hotel-card" key={i}>
                  <div className="hotel-card__img-wrap">
                    <img src={hotel.img} alt={hotel.name} loading="lazy" />
                  </div>
                  <div className="hotel-card__body">
                    <div className="hotel-card__stars">
                      {'★'.repeat(hotel.stars)}{'☆'.repeat(5 - hotel.stars)}
                    </div>
                    <h3 className="hotel-card__name">{hotel.name}</h3>
                    <p className="hotel-card__address">{hotel.address}</p>
                    <div className="hotel-card__meta">
                      <span className="hotel-card__distance">{hotel.distance}</span>
                      <span className="hotel-card__price">{hotel.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
