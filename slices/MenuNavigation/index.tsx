import { FC } from "react";
import { Content} from "@prismicio/client";
import { SliceComponentProps, PrismicLink} from "@prismicio/react";

/**
 * Props for `MenuNavigation`.
 */
export type MenuNavigationProps =
  SliceComponentProps<Content.MenuNavigationSlice>;

/**
 * Component for "Menu Navigation" Slices.
 */
const MenuNavigation: FC<MenuNavigationProps> = ({ slice }) => {
  const logoItem = slice.primary.logo_area?.[0];  
  const mainLogoText = logoItem?.main_text || "BEAM BEAM"; 
  const highlightedLogoText = logoItem?.highlighted_text || "Digital"; 
  const menuItems = slice.primary.menu_links || [];
   
  return (
    <nav className="nav" id="nav">
      <div className="nav-container">
            <a href="#home" className="nav-logo">
                <span className="logo-beam">{mainLogoText}</span> 
                <span className="logo-digital">{highlightedLogoText}</span>
            </a>
            <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
                <span className="hamburger"></span>
            </button>
            <ul className="nav-menu">
               {menuItems.length > 0 ? (
                  menuItems.map((item, index) => (
                     <li key={index}>
                      <PrismicLink
                        field={item.link}
                      className="nav-link"
                  >
                  {item.label || "Link"}
              </PrismicLink></li>
            ))
          ) : (
            <>
             <li><a href="#services" className="nav-link">Services</a></li>
             <li><a href="#about" className="nav-link">About</a></li>
                <li><a href="#pricing" className="nav-link">Pricing</a></li>
                <li><a href="#work" className="nav-link">Work</a></li>
                <li><a href="#contact" className="nav-link">Contact</a></li>
            </>
          )}
          </ul>
      </div>
       </nav>
  );
};

export default MenuNavigation;
