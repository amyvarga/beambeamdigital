import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps} from "@prismicio/react";
import Link from "next/link";

export type FooterProps =
  SliceComponentProps<Content.FooterNavigationAndServicesRegionsSlice>;

const Footer: FC<FooterProps> = ({ slice }) => {
  return (
    <footer
      className="footer section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="footer-bottom">
        <p>{slice.primary.copyright_notice}</p>
        <p><Link href="/cookie-policy">Cookie policy</Link></p>
      </div>
    </footer>
  );
};

export default Footer;
