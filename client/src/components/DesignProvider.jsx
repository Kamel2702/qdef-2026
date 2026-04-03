import { useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';

function hexToRgba(hex, alpha) {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return '';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function DesignProvider() {
  const config = useConfig();

  useEffect(() => {
    if (!config || Object.keys(config).length === 0) return;

    let styleEl = null;
    let fontLinkEl = null;
    const root = document.documentElement;

        // Colors
        if (config.design_color_accent) {
          root.style.setProperty('--color-accent', config.design_color_accent);
          root.style.setProperty('--color-blue', config.design_color_accent);
          root.style.setProperty('--color-cyan', config.design_color_accent);
          root.style.setProperty('--color-purple', config.design_color_accent);
          root.style.setProperty('--color-info', config.design_color_accent);
          root.style.setProperty('--color-accent-pale', hexToRgba(config.design_color_accent, 0.08));
          root.style.setProperty('--color-accent-glow', hexToRgba(config.design_color_accent, 0.25));
        }
        if (config.design_color_accent_hover) {
          root.style.setProperty('--color-accent-hover', config.design_color_accent_hover);
          root.style.setProperty('--color-blue-hover', config.design_color_accent_hover);
        }
        if (config.design_color_accent && config.design_color_accent_hover) {
          const grad = `linear-gradient(135deg, ${config.design_color_accent}, ${config.design_color_accent_hover})`;
          root.style.setProperty('--gradient-primary', grad);
          root.style.setProperty('--gradient-purple', grad);
          root.style.setProperty('--gradient-blue', grad);
          root.style.setProperty('--gradient-cyan', grad);
          root.style.setProperty('--gradient-hero', grad);
          root.style.setProperty('--gradient-text', grad);
        }
        if (config.design_color_bg) {
          root.style.setProperty('--color-bg', config.design_color_bg);
          root.style.setProperty('--color-gray-50', config.design_color_bg);
        }
        if (config.design_color_bg_alt) {
          root.style.setProperty('--color-bg-alt', config.design_color_bg_alt);
          root.style.setProperty('--color-gray-100', config.design_color_bg_alt);
        }
        if (config.design_color_bg_dark) {
          root.style.setProperty('--color-bg-dark', config.design_color_bg_dark);
        }
        if (config.design_color_surface) {
          root.style.setProperty('--color-surface', config.design_color_surface);
          root.style.setProperty('--color-white', config.design_color_surface);
          root.style.setProperty('--glass-bg', hexToRgba(config.design_color_surface, 0.9));
        }
        if (config.design_color_text) {
          root.style.setProperty('--color-gray-600', config.design_color_text);
          document.body.style.color = config.design_color_text;
        }
        if (config.design_color_heading) {
          root.style.setProperty('--color-gray-900', config.design_color_heading);
        }
        if (config.design_color_red) {
          root.style.setProperty('--color-red', config.design_color_red);
          root.style.setProperty('--color-error', config.design_color_red);
        }
        if (config.design_color_success) root.style.setProperty('--color-success', config.design_color_success);
        if (config.design_color_warning) root.style.setProperty('--color-warning', config.design_color_warning);

        // Typography
        if (config.design_google_font_url) {
          fontLinkEl = document.createElement('link');
          fontLinkEl.rel = 'stylesheet';
          fontLinkEl.href = config.design_google_font_url;
          document.head.appendChild(fontLinkEl);
        }
        if (config.design_font_body) {
          root.style.setProperty('--font-family', config.design_font_body);
          if (!config.design_font_heading) {
            root.style.setProperty('--font-display', config.design_font_body);
          }
        }
        if (config.design_font_heading) {
          root.style.setProperty('--font-display', config.design_font_heading);
        }
        if (config.design_font_size) {
          root.style.fontSize = config.design_font_size;
        }

        // Layout
        if (config.design_radius_buttons) {
          root.style.setProperty('--radius-btn', config.design_radius_buttons);
        }
        if (config.design_radius_cards) {
          root.style.setProperty('--radius-md', config.design_radius_cards);
        }
        if (config.design_max_width) {
          root.style.setProperty('--max-width', config.design_max_width);
        }
        if (config.design_section_padding) {
          root.style.setProperty('--space-4xl', config.design_section_padding);
        }

        // Heading weight
        if (config.design_heading_weight) {
          styleEl = document.createElement('style');
          let css = `h1,h2,h3,h4,h5,h6,.section-title{font-weight:${config.design_heading_weight}!important;}`;
          if (config.design_custom_css) {
            css += config.design_custom_css;
          }
          styleEl.textContent = css;
          document.head.appendChild(styleEl);
        } else if (config.design_custom_css) {
          styleEl = document.createElement('style');
          styleEl.textContent = config.design_custom_css;
          document.head.appendChild(styleEl);
        }

    return () => {
      if (styleEl) styleEl.remove();
      if (fontLinkEl) fontLinkEl.remove();
    };
  }, [config]);

  return null;
}
