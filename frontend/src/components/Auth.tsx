import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../api/client';

interface AuthProps {
  onSuccess: () => void;
}

// Country data: name, dialing code, ISO code, required local-number digit count
const COUNTRIES = [
  { name: 'Afghanistan',           code: 'AF', dial: '+93',   digits: 9  },
  { name: 'Albania',               code: 'AL', dial: '+355',  digits: 9  },
  { name: 'Algeria',               code: 'DZ', dial: '+213',  digits: 9  },
  { name: 'Argentina',             code: 'AR', dial: '+54',   digits: 10 },
  { name: 'Australia',             code: 'AU', dial: '+61',   digits: 9  },
  { name: 'Austria',               code: 'AT', dial: '+43',   digits: 10 },
  { name: 'Bangladesh',            code: 'BD', dial: '+880',  digits: 10 },
  { name: 'Belgium',               code: 'BE', dial: '+32',   digits: 9  },
  { name: 'Brazil',                code: 'BR', dial: '+55',   digits: 11 },
  { name: 'Canada',                code: 'CA', dial: '+1',    digits: 10 },
  { name: 'Chile',                 code: 'CL', dial: '+56',   digits: 9  },
  { name: 'China',                 code: 'CN', dial: '+86',   digits: 11 },
  { name: 'Colombia',              code: 'CO', dial: '+57',   digits: 10 },
  { name: 'Croatia',               code: 'HR', dial: '+385',  digits: 9  },
  { name: 'Czech Republic',        code: 'CZ', dial: '+420',  digits: 9  },
  { name: 'Denmark',               code: 'DK', dial: '+45',   digits: 8  },
  { name: 'Egypt',                 code: 'EG', dial: '+20',   digits: 10 },
  { name: 'Ethiopia',              code: 'ET', dial: '+251',  digits: 9  },
  { name: 'Finland',               code: 'FI', dial: '+358',  digits: 10 },
  { name: 'France',                code: 'FR', dial: '+33',   digits: 9  },
  { name: 'Germany',               code: 'DE', dial: '+49',   digits: 10 },
  { name: 'Ghana',                 code: 'GH', dial: '+233',  digits: 9  },
  { name: 'Greece',                code: 'GR', dial: '+30',   digits: 10 },
  { name: 'Hong Kong',             code: 'HK', dial: '+852',  digits: 8  },
  { name: 'Hungary',               code: 'HU', dial: '+36',   digits: 9  },
  { name: 'India',                 code: 'IN', dial: '+91',   digits: 10 },
  { name: 'Indonesia',             code: 'ID', dial: '+62',   digits: 10 },
  { name: 'Iran',                  code: 'IR', dial: '+98',   digits: 10 },
  { name: 'Iraq',                  code: 'IQ', dial: '+964',  digits: 10 },
  { name: 'Ireland',               code: 'IE', dial: '+353',  digits: 9  },
  { name: 'Israel',                code: 'IL', dial: '+972',  digits: 9  },
  { name: 'Italy',                 code: 'IT', dial: '+39',   digits: 10 },
  { name: 'Japan',                 code: 'JP', dial: '+81',   digits: 10 },
  { name: 'Jordan',                code: 'JO', dial: '+962',  digits: 9  },
  { name: 'Kenya',                 code: 'KE', dial: '+254',  digits: 9  },
  { name: 'Malaysia',              code: 'MY', dial: '+60',   digits: 9  },
  { name: 'Mexico',                code: 'MX', dial: '+52',   digits: 10 },
  { name: 'Morocco',               code: 'MA', dial: '+212',  digits: 9  },
  { name: 'Myanmar',               code: 'MM', dial: '+95',   digits: 9  },
  { name: 'Netherlands',           code: 'NL', dial: '+31',   digits: 9  },
  { name: 'New Zealand',           code: 'NZ', dial: '+64',   digits: 9  },
  { name: 'Nigeria',               code: 'NG', dial: '+234',  digits: 10 },
  { name: 'Norway',                code: 'NO', dial: '+47',   digits: 8  },
  { name: 'Pakistan',              code: 'PK', dial: '+92',   digits: 10 },
  { name: 'Philippines',           code: 'PH', dial: '+63',   digits: 10 },
  { name: 'Poland',                code: 'PL', dial: '+48',   digits: 9  },
  { name: 'Portugal',              code: 'PT', dial: '+351',  digits: 9  },
  { name: 'Romania',               code: 'RO', dial: '+40',   digits: 9  },
  { name: 'Russia',                code: 'RU', dial: '+7',    digits: 10 },
  { name: 'Saudi Arabia',          code: 'SA', dial: '+966',  digits: 9  },
  { name: 'Singapore',             code: 'SG', dial: '+65',   digits: 8  },
  { name: 'South Africa',          code: 'ZA', dial: '+27',   digits: 9  },
  { name: 'South Korea',           code: 'KR', dial: '+82',   digits: 10 },
  { name: 'Spain',                 code: 'ES', dial: '+34',   digits: 9  },
  { name: 'Sri Lanka',             code: 'LK', dial: '+94',   digits: 9  },
  { name: 'Sweden',                code: 'SE', dial: '+46',   digits: 9  },
  { name: 'Switzerland',           code: 'CH', dial: '+41',   digits: 9  },
  { name: 'Taiwan',                code: 'TW', dial: '+886',  digits: 9  },
  { name: 'Tanzania',              code: 'TZ', dial: '+255',  digits: 9  },
  { name: 'Thailand',              code: 'TH', dial: '+66',   digits: 9  },
  { name: 'Turkey',                code: 'TR', dial: '+90',   digits: 10 },
  { name: 'Uganda',                code: 'UG', dial: '+256',  digits: 9  },
  { name: 'Ukraine',               code: 'UA', dial: '+380',  digits: 9  },
  { name: 'United Arab Emirates',  code: 'AE', dial: '+971',  digits: 9  },
  { name: 'United Kingdom',        code: 'GB', dial: '+44',   digits: 10 },
  { name: 'United States',         code: 'US', dial: '+1',    digits: 10 },
  { name: 'Vietnam',               code: 'VN', dial: '+84',   digits: 9  },
];

type Country = typeof COUNTRIES[0];

/** Convert ISO alpha-2 code to flag emoji */
function flagEmoji(code: string) {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);

  // Phone state
  const defaultCountry = COUNTRIES.find(c => c.code === 'US')!;
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [phoneNumber, setPhoneNumber]         = useState('');
  const [phoneError, setPhoneError]           = useState('');
  const [password, setPassword]               = useState('');
  const [passwordError, setPasswordError]     = useState('');
  const [companyName, setCompanyName]         = useState('');
  const [email, setEmail]                     = useState('');
  const [globalError, setGlobalError]         = useState('');
  const [isLoading, setIsLoading]             = useState(false);
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [countrySearch, setCountrySearch]     = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setCountrySearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (dropdownOpen) searchRef.current?.focus();
  }, [dropdownOpen]);

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.dial.includes(countrySearch)
  );

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '');
    setPhoneNumber(raw);
    if (raw.length > 0 && raw.length < selectedCountry.digits) {
      setPhoneError(`${selectedCountry.name} requires ${selectedCountry.digits} digits (${raw.length} entered)`);
    } else if (raw.length > selectedCountry.digits) {
      setPhoneError(`${selectedCountry.name} numbers must be exactly ${selectedCountry.digits} digits`);
    } else {
      setPhoneError('');
    }
  }

  function handleCountrySelect(country: Country) {
    setSelectedCountry(country);
    setPhoneNumber('');
    setPhoneError('');
    setDropdownOpen(false);
    setCountrySearch('');
  }

  function validatePassword(pass: string) {
    if (pass.length < 8) return 'Password must be at least 8 characters long';
    if (!/^[A-Z]/.test(pass)) return 'First character must be a capital letter';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return 'Password must contain at least 1 special character';
    if (!/\d/.test(pass)) return 'Password must contain at least 1 digit';
    return '';
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setPassword(val);
    if (!isLogin && val) {
      setPasswordError(validatePassword(val));
    } else if (!isLogin && !val) {
      setPasswordError('Password is required');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    if (!isLogin) {
      if (phoneNumber.length !== selectedCountry.digits) {
        setPhoneError(`${selectedCountry.name} requires exactly ${selectedCountry.digits} digits`);
        return;
      }
      const passErr = validatePassword(password);
      if (passErr) {
        setPasswordError(passErr);
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const res = await apiClient.post<{ status: string, user_data: any }>('/auth/login', {
          email,
          password
        });
        localStorage.setItem('user', JSON.stringify(res.user_data));
        onSuccess();
      } else {
        await apiClient.post('/auth/register', {
          company_name: companyName,
          email,
          phone: `${selectedCountry.dial}${phoneNumber}`,
          password,
          role: 'supplier'
        });
        localStorage.setItem('user', JSON.stringify({ email, role: 'supplier' }));
        onSuccess();
      }
    } catch (error: any) {
      const msg = error.message || "An error occurred";
      if (msg === "User not found") {
        setIsLogin(false);
        setGlobalError("Account not found. Please sign up.");
      } else {
        setGlobalError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
            </div>
            <h1 className="auth-title">
              {isLogin ? 'Sign in to your account' : 'Create an account'}
            </h1>
            <p className="auth-subtitle">
              Welcome to LoopX, the premier B2B materials marketplace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {globalError && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
                {globalError}
              </div>
            )}

            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="company-name">Company Name</label>
                  <input
                    id="company-name"
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="form-input"
                    placeholder="Acme Corp"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Business Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                placeholder="contact@acme.com"
              />
            </div>

            {/* ── Phone Number with Country Code Picker ── */}
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="phone-number">Phone Number</label>
              <div className="phone-input-wrapper" ref={dropdownRef}>

                {/* Country Code Button */}
                <button
                  type="button"
                  id="country-code-btn"
                  className="phone-country-btn"
                  onClick={() => setDropdownOpen(o => !o)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="listbox"
                  title="Select country code"
                >
                  <span className="phone-flag">{flagEmoji(selectedCountry.code)}</span>
                  <span className="phone-dial">{selectedCountry.dial}</span>
                  <svg
                    className={`phone-chevron${dropdownOpen ? ' open' : ''}`}
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Number Input */}
                <input
                  id="phone-number"
                  type="tel"
                  inputMode="numeric"
                  required={!isLogin}
                  className={`form-input phone-number-input${phoneError ? ' input-error' : ''}`}
                  placeholder={`${selectedCountry.digits} digits`}
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={selectedCountry.digits}
                  aria-describedby="phone-hint"
                />

                {/* Country Dropdown */}
                {dropdownOpen && (
                  <div className="country-dropdown" role="listbox" aria-label="Select country">
                    <div className="country-search-wrap">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                      </svg>
                      <input
                        ref={searchRef}
                        type="text"
                        className="country-search-input"
                        placeholder="Search country or code…"
                        value={countrySearch}
                        onChange={e => setCountrySearch(e.target.value)}
                      />
                    </div>
                    <ul className="country-list">
                      {filteredCountries.length === 0 && (
                        <li className="country-empty">No countries found</li>
                      )}
                      {filteredCountries.map(country => (
                        <li
                          key={country.code}
                          role="option"
                          aria-selected={country.code === selectedCountry.code}
                          className={`country-option${country.code === selectedCountry.code ? ' selected' : ''}`}
                          onClick={() => handleCountrySelect(country)}
                        >
                          <span className="country-flag">{flagEmoji(country.code)}</span>
                          <span className="country-name">{country.name}</span>
                          <span className="country-dial-code">{country.dial}</span>
                          <span className="country-digits-hint">{country.digits}d</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Hint / error text */}
                {phoneError ? (
                  <p id="phone-hint" className="phone-error-msg" role="alert">{phoneError}</p>
                ) : (
                  <p id="phone-hint" className="phone-hint-msg">
                    {selectedCountry.name} · {selectedCountry.dial} · {selectedCountry.digits}-digit number
                  </p>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                {isLogin ? 'Password' : 'Create Password'}
              </label>
              <input
                id="password"
                type="password"
                required
                className="form-input"
                style={(!isLogin && passwordError) ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.12)' } : undefined}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
              />
              {!isLogin && passwordError && (
                <p className="phone-error-msg" role="alert" style={{ marginTop: '4px' }}>
                  {passwordError}
                </p>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '8px', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="auth-toggle">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { 
                setIsLogin(!isLogin); 
                setGlobalError('');
                setPhoneNumber(''); 
                setPhoneError('');
                setPassword('');
                setPasswordError('');
              }}
              className="auth-toggle-btn"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '36px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2 }}>
          Accelerate your transition to a circular economy.
        </h2>
        <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: 1.6, maxWidth: '480px' }}>
          Join hundreds of leading enterprises trading surplus packaging materials. Cut procurement costs and reduce your scope 3 emissions on a single, secure platform.
        </p>
        <div style={{ display: 'flex', gap: '24px', marginTop: '48px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>2.4K+</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Active Listings</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>850t</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>CO₂ Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
}