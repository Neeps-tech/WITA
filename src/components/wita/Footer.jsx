import Link from "next/link";
import Image from "next/image";
import { contactInfo, footerLinks } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="wita-footer">
      <div className="container wita-footer-grid">
        <div className="wita-footer-brand">
          <Image
            src="/images/wita-logo.png"
            alt="WITA logo"
            width={170}
            height={54}
          />
          <p>
            Women In Tourism Africa advances gender equality, economic empowerment,
            and inclusive leadership across the tourism, travel, and hospitality sectors.
          </p>
        </div>

        <div>
          <h4>Who We Are</h4>
          <ul>
            {footerLinks.organization.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Follow Us</h4>
          <ul>
            {footerLinks.followUs.map((channel) => (
              <li key={channel}>{channel}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Contact Info</h4>
          <p>{contactInfo.address}</p>
          <p>{contactInfo.phone}</p>
          <p>{contactInfo.email}</p>
        </div>
      </div>

      <div className="container wita-footer-bottom">
        <p className="wita-footer-copyright">
          © {new Date().getFullYear()} Women In Tourism Africa. All rights reserved.
        </p>
        <div className="wita-footer-credit">
          <p>
            Design & Dev by{" "}
            <a
              href="https://neepsconsulting.com/IT"
              target="_blank"
              rel="noopener noreferrer"
              className="neeps-link"
            >
              NEEPS
            </a>
          </p>
        </div>
      </div>


    </footer>
  );
}
