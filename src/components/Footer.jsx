import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDown, Globe, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { isValidEmail } from '../utils/validation';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = e => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      return setEmailError(true);
    }
    if (!termsAccepted) return;
    setSuccess(true);
  };

  useEffect(() => {
    if (!email) setEmailError(false);
  }, [email]);

  return (
    <>
      {success ? (
        <p className="mb-5 text-xl leading-5 font-bold">
          Thanks! You've successfully signed up for the newsletter and will receive an email shortly.
        </p>
      ) : (
        <form onSubmit={submit}>
          <p className="mb-5 text-xl font-bold">SUBSCRIBE TO TAKE 10% OFF ALL NEW ARRIVALS</p>

          <input
            type="email"
            name="email"
            onInput={e => setEmail(e.target.value)}
            placeholder="EMAIL ADDRESS"
            className="text-dark w-full border-b border-[#817d73] py-2 text-sm placeholder:text-inherit focus:outline-none"
          />

          {/* Email Error (initially hidden) */}
          {emailError && <p className="mt-1 text-xs text-red-600">Please provide a valid email address</p>}

          {/* Terms Checkbox (initially hidden) */}
          {email && (
            <label className="mt-1 flex items-start gap-2 text-xs">
              <input
                type="checkbox"
                name="terms"
                onChange={e => setTermsAccepted(e.target.checked)}
                className="mt-1 accent-[#ff6600]"
              />
              <p className="font-medium">
                <span>I have read and accept the </span>
                <a href="https://www.newlinehalo.com/newsletter-terms-conditions.html" className="underline">
                  terms and conditions
                </a>
                <span> for the HALO newsletter</span>
              </p>
            </label>
          )}

          {/* Checkbox Error (initially hidden) */}
          {!termsAccepted && email && (
            <p className="mt-1 text-xs text-red-600">Please accept terms and conditions in order to continue</p>
          )}

          {email ? (
            <button className="btn mt-6 text-[13px] max-md:w-full" type="submit">
              Subscribe
            </button>
          ) : (
            <button className="btn mt-6 text-[13px] [--btn-bg:#ff6600] max-md:w-full" type="submit">
              Sign Up
            </button>
          )}
        </form>
      )}
    </>
  );
};

const disclosures = [
  {
    title: '01 / Halo',
    links: [
      { title: 'About Halo', url: '#' },
      { title: 'Contact', url: '#' },
      { title: 'Become a retailer', url: '#' },
    ],
  },
  {
    title: '02 / Customer Service',
    links: [
      { title: 'FAQ', url: '#' },
      { title: 'Delivery', url: '#' },
      { title: 'Returns', url: '#' },
      { title: 'Size Guide', url: '#' },
      { title: 'My Account', url: '#' },
      { title: 'Terms & Conditions', url: '#' },
      { title: 'Privacy Policy', url: '#' },
      { title: 'Cookies', url: '#' },
    ],
  },
  {
    title: '03 / Popular picks',
    links: [
      { title: 'Fleece', url: '#' },
      { title: "Women's specific", url: '#' },
      { title: 'Outdoor', url: '#' },
      { title: 'Essentials', url: '#' },
    ],
  },
  {
    title: (
      <span className="flex items-end gap-2">
        <Globe strokeWidth={1} size={18} />
        International
      </span>
    ),
    links: [
      { title: 'International', url: '#' },
      { title: 'Denmark', url: '#' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="min-h-[50vh] uppercase">
      <Marquee className="border border-[#cbcbcb] py-4 text-[11px] font-bold" autoFill>
        <div className="bg-dark ml-10 h-[.5em] w-[.5em]"></div>
        <span className="mx-8">Free shipping on orders over 50 EUR</span>
        <div className="bg-dark mr-10 h-[.5em] w-[.5em]"></div>
      </Marquee>

      <div className="w-full md:flex">
        {/* Newsletter Signup Section */}
        <div className="w-full p-5 sm:order-last md:w-3/12 md:p-7.5">
          <NewsletterSignup />
        </div>

        {/* Disclosures (hidden on md+) */}
        <div className="flex w-full flex-col border-t border-[#cbcbcb] md:hidden">
          {disclosures.map(({ title, links }, index) => (
            <Disclosure key={index}>
              {({ open }) => (
                <div className="border-b border-[#cbcbcb] text-[11px]">
                  <DisclosureButton className="flex w-full items-center justify-between px-5 py-2.5 font-bold uppercase">
                    {title}
                    {open ? <Minus /> : <Plus />}
                  </DisclosureButton>
                  <div className="overflow-hidden">
                    <DisclosurePanel
                      transition
                      className="origin-top px-5 pb-2 transition duration-200 ease-out data-closed:-translate-y-full"
                    >
                      <ul className="flex flex-col gap-2">
                        {links.map(({ title, url }, index) => (
                          <li key={index}>
                            <a href={url} className="font-medium uppercase hover:underline">
                              {title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </DisclosurePanel>
                  </div>
                </div>
              )}
            </Disclosure>
          ))}
        </div>

        {/* Disclosures (visible on md+) */}
        <div className="hidden w-6/12 border-l border-[#cbcbcb] md:flex">
          {disclosures.map(
            ({ title, links }, index) =>
              index <= 2 && (
                <div className="w-1/3 border-r border-[#cbcbcb] p-7.5 text-[11px]">
                  <h6 className="mb-5 flex w-full items-center justify-between font-bold uppercase">{title}</h6>
                  <ul className="flex flex-col gap-2">
                    {links.map(({ title, url }, index) => (
                      <li key={index}>
                        <a href={url} className="font-medium uppercase hover:underline">
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
          )}
        </div>

        <div className="text-dark w-full px-5 py-5 text-[11px] md:order-first md:w-3/12 md:p-7.5">
          {/* Logo */}
          <div className="mb-7 md:mb-10.5">
            <img src="icons/logo.svg" alt="Halo Logo" className="md:w-[93px]" />
          </div>

          {/* Address Info */}
          <div className="mb-7 leading-3 font-medium md:mb-10.5">
            <span>© HUMMEL CENOZOIC APS</span>
            <br />
            <span>Balticagade 20</span>
            <br />
            <span>8000 Aarhus C</span>
            <br />
            <span>DENMARK</span>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="mb-2 font-semibold uppercase">Follow Us</h2>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/newline.halo/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://www.newlinehalo.com/on/demandware.static/-/Sites-halo-Library/default/dwc49e2550/footer/facebook.svg"
                  alt="Facebook"
                  className="size-6"
                />
              </a>
              <a href="https://www.instagram.com/newline.halo/?hl=da" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://www.newlinehalo.com/on/demandware.static/-/Sites-halo-Library/default/dw634be4e9/footer/instagram.svg"
                  alt="Instagram"
                  className="size-6"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-[#cbcbcb]">
        <div className="flex w-full flex-wrap items-center justify-between px-6 py-4">
          <div className="w-1/2 text-xs md:w-8/12 lg:w-9/12">
            <span>CVR: 43317032</span> / <span>ALL RIGHTS RESERVED</span>
          </div>
          <div className="flex w-1/2 items-center justify-end md:w-4/12 md:justify-between lg:w-3/12">
            <div className="group relative hidden items-center md:flex">
              <Globe className="mr-4" size={20} />
              <button className="text-sm focus:outline-none" tabIndex={0} aria-haspopup="true">
                International
              </button>
              <ChevronDown />
              <div className="absolute bottom-full left-0 z-10 hidden rounded border bg-white shadow-md group-hover:block">
                <a href="#" className="block px-4 py-2 text-sm hover:bg-black hover:text-white">
                  International
                </a>
                <a href="https://www.newlinehalo.dk/" className="block px-4 py-2 text-sm hover:bg-black hover:text-white">
                  Denmark
                </a>
              </div>
            </div>
            <a href="http://www.thornico.com/" target="_blank" rel="noopener noreferrer" className="ml-4">
              <img src="icons/thornico-logo.svg" alt="thornico" className="h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
