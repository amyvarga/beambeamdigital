"use client";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicLink } from "@prismicio/react";

export type MenuNavigationProps =
  SliceComponentProps<Content.MenuNavigationSlice>;

const NAV_ROUTE_GROUPS: Record<string, readonly string[]> = {
  services: [
    "/web-developer-south-devon",
    "/website-design-development",
    "/search-conversion-optimisation",
    "/business-starter-website",
    "/bespoke-website",
    "/website-support",
    "/seo-audit",
    "/seo-reviews",
  ],
};

function isMatchingPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isNavGroupActive(group: string | undefined, pathname: string) {
  return group
    ? NAV_ROUTE_GROUPS[group]?.some((path) => isMatchingPath(pathname, path)) ?? false
    : false;
}

const MenuNavigation: FC<MenuNavigationProps> = ({ slice }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.querySelectorAll<HTMLAnchorElement>("a.nav-link").forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      const linkPath = href.startsWith("http") ? new URL(href).pathname : href;
      const matchesLinkedPage = !!linkPath && isMatchingPath(pathname, linkPath);
      const matchesRouteGroup = isNavGroupActive(
        link.dataset.navGroup,
        pathname,
      );
      link.classList.toggle("selected", matchesLinkedPage || matchesRouteGroup);
    });

    document.querySelectorAll<HTMLElement>(".nav-dropdown-toggle").forEach((toggle) => {
      const dropdown = toggle.closest(".nav-dropdown");
      const hasSelectedChild = !!dropdown?.querySelector("a.nav-link.selected");
      const matchesRouteGroup = isNavGroupActive(
        toggle.dataset.navGroup,
        pathname,
      );
      toggle.classList.toggle("selected", hasSelectedChild || matchesRouteGroup);
    });
  }, [pathname]);

  const logoItem = slice.primary.logo_area?.[0];
  const mainLogoText = logoItem?.main_text || "BEAM BEAM";
  const highlightedLogoText = logoItem?.highlighted_text || "Digital";
  const menuItems = slice.primary.menu_links || [];

  return (
    <nav className="nav" id="nav">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <Image
            src="/images/logo.png"
            alt=""
            width={60}
            height={60}
            className="nav-logo-image"
            priority
          />
          <span className="nav-logo-text">
            <span className="logo-beam">{mainLogoText}</span>
            <span className="logo-digital">{highlightedLogoText}</span>
          </span>
        </Link>
        <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span className="hamburger"></span>
        </button>
        <ul className="nav-menu" aria-hidden="true">
          {menuItems.map((item, index) => {
            const navGroup = item.label?.trim().toLowerCase() || undefined;

            if (item.dropdown) {
              const subLinks = [
                { title: item.dropdown_title, link: item.dropdown_link },
                { title: item.dropdown_title_2, link: item.dopdown_link_2 },
                { title: item.dropdown_title_3, link: item.dropdown_link_3 },
              ].filter((sub) => sub.title?.trim());

              if (subLinks.length === 0) {
                return (
                  <li key={index}>
                    <PrismicLink
                      field={item.link}
                      className="nav-link"
                      data-nav-group={navGroup}
                    >
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
                    data-nav-group={navGroup}
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
                <PrismicLink
                  field={item.link}
                  className="nav-link col"
                  data-nav-group={navGroup}
                >
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
