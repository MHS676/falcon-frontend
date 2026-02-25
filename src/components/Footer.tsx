import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../../upload/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="Falcon Security Logo" className="w-12 h-12 object-contain" />
              <h3 className="text-xl font-heading font-bold">Falcon® Security</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A security, planning, management and service company enjoying the confidence 
              of our clientele since 1993. ISO 9001, 18788 & 27001 certified.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-red-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-red-500 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-red-500 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-red-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  House # 155, Lane # 3, Eastern Road,<br />
                  New D.O.H.S. Mohakhali, Dhaka 1206
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-red-500 flex-shrink-0" />
                <a href="tel:+8801618325266" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  +880 1618 325266
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-red-500 flex-shrink-0" />
                <a href="mailto:info@falconslimited.com" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  info@falconslimited.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://www.facebook.com/falconslimited"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors text-2xl"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.linkedin.com/company/falconslimited"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors text-2xl"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="mailto:info@falconslimited.com"
                className="text-gray-400 hover:text-red-500 transition-colors text-2xl"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Founder member of BPSSPA<br />
              Platinum distributor — ISM UK
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Falcon® Security Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
