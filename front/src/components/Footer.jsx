import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800  text-white py-8 px-4 md:px-16 lg:px-24 mt-24">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-semibold">IIIT Mart</h3>
          <p className="mt-4">
            IIIT Mart is a platform for students to buy and sell products within the campus.Students can buy and sell products like books, electronics, furniture, etc. IIIT Mart has been Created by Sanyam Agrawal, a student of IIIT Hyderabad studying 2nd year B.Tech CSE
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/home" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/buy" className="hover:underline">
                Buy
              </Link>
            </li>
            <li>
              <Link to="/orders/pending" className="hover:underline">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/sell" className="hover:underline">
                Sell
              </Link>
            </li>
            
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Contact The Developer</h4>
          <ul className="space-y-2">
            <li>Phone: +91 98775 98996</li>
            <li>Email: sanyamagrawal2005@gmail.com</li>
            <li>Address: IIT Hyderabad, Gachibowli, Hyderabad</li>
            <li>Country: India</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto text-center mt-8">
        <p>&copy; {new Date().getFullYear()} IIIT Mart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
