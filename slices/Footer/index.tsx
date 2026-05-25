import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps} from "@prismicio/react";

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
      </div>
    </footer>
  );
};

export default Footer;
