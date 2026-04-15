"use client";
import { FC, useEffect } from "react";
import { Content } from "@prismicio/client";
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
  useEffect(() => {
    const path = window.location.pathname;
    document.querySelectorAll("a.nav-link").forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      const linkPath = href.startsWith("http") ? new URL(href).pathname : href;
      link.classList.toggle("active", !!linkPath && path === linkPath);
    });
  }, []);

  const logoItem = slice.primary.logo_area?.[0];
  const mainLogoText = logoItem?.main_text || "BEAM BEAM";
  const highlightedLogoText = logoItem?.highlighted_text || "Digital";
  const menuItems = slice.primary.menu_links || [];
   
  return (
    <nav className="nav" id="nav">
      <div className="nav-container">
            <a href="/" className="nav-logo">
                <span className="logo-beam">{mainLogoText}</span> 
                <span className="logo-digital">{highlightedLogoText}</span>
            </a>
            <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
                <span className="hamburger"></span>
            </button>
            <ul className="nav-menu" aria-hidden="true">
               {menuItems.map((item, index) => (
                  <li key={index}>
                    <PrismicLink field={item.link} className="nav-link col">
                      {item.label || "Link"}
                    </PrismicLink>
                  </li>
                ))}
          </ul>
      </div>
       </nav>
  );
};

export default MenuNavigation;
