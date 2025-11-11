import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { marketingTextMap } from '../../marketing.text-map';

export const MarketingFooter = () => {
  const { footer } = marketingTextMap;

  return (
    <footer className="bg-muted/30 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2">
            <h3 className="mb-2 text-lg font-bold">Gym Tracker</h3>
            <p className="text-muted-foreground text-sm">{footer.tagline}</p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="mb-4 font-semibold">{footer.links.product.title}</h4>
            <ul className="space-y-2">
              {footer.links.product.items.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="mb-4 font-semibold">{footer.links.legal.title}</h4>
            <ul className="space-y-2">
              {footer.links.legal.items.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="text-muted-foreground text-center text-sm">
          {footer.copyright}
        </div>
      </div>
    </footer>
  );
};
