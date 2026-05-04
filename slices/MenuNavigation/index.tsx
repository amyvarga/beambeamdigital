"use client";
import { FC, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicLink } from "@prismicio/react";

export type MenuNavigationProps =
  SliceComponentProps<Content.MenuNavigationSlice>;

const MenuNavigation: FC<MenuNavigationProps> = ({ slice }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.querySelectorAll("a.nav-link").forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      const linkPath = href.startsWith("http") ? new URL(href).pathname : href;
      link.classList.toggle("active", !!linkPath && pathname === linkPath);
    });

    document.querySelectorAll(".nav-dropdown-toggle").forEach((toggle) => {
      const dropdown = toggle.closest(".nav-dropdown");
      const hasActiveChild = !!dropdown?.querySelector("a.nav-link.active");
      toggle.classList.toggle("active", hasActiveChild);
    });
  }, [pathname]);

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
          {menuItems.map((item, index) => {
            if (item.dropdown) {
              const subLinks = [
                { title: item.dropdown_title, link: item.dropdown_link },
                { title: item.dropdown_title_2, link: item.dopdown_link_2 },
                { title: item.dropdown_title_3, link: item.dropdown_link_3 },
              ].filter((sub) => sub.title?.trim());

              if (subLinks.length === 0) {
                return (
                  <li key={index}>
                    <PrismicLink field={item.link} className="nav-link">
                      {item.label || "Link"}
                    </PrismicLink>
                  </li>
                );
              }

              const isOpen = openDropdown === index;

              return (
                <li key={index} className="nav-item nav-dropdown">
                  <button
                    className="nav-link nav-dropdown-toggle"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => setOpenDropdown(isOpen ? null : index)}
                  >
                    {item.label || "Link"}
                  </button>
                  <ul
                    className={`nav-dropdown-menu${isOpen ? " open" : ""}`}
                    aria-hidden={!isOpen}
                  >
                    {subLinks.map((sub, i) => (
                      <li key={i}>
                        <PrismicLink field={sub.link} className="nav-link nav-dropdown-link">
                          {sub.title}
                        </PrismicLink>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            return (
              <li key={index}>
                <PrismicLink field={item.link} className="nav-link col">
                  {item.label || "Link"}
                </PrismicLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default MenuNavigation;
