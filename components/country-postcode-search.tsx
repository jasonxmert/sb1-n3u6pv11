"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Globe2, MapPin, Building2 } from "lucide-react";

interface CountryPostcodeSearchProps {
  onSelect: (result: any) => void;
}

const countries = [
  { code: "AD", name: "Andorra" },
  { code: "AR", name: "Argentina" },
  { code: "AS", name: "American Samoa" },
  { code: "AT", name: "Austria" },
  { code: "AU", name: "Australia" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CH", name: "Switzerland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DE", name: "Germany" },
  { code: "DK", name: "Denmark" },
  { code: "DO", name: "Dominican Republic" },
  { code: "ES", name: "Spain" },
  { code: "FI", name: "Finland" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "GF", name: "French Guiana" },
  { code: "GG", name: "Guernsey" },
  { code: "GL", name: "Greenland" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GT", name: "Guatemala" },
  { code: "GU", name: "Guam" },
  { code: "GY", name: "Guyana" },
  { code: "HR", name: "Croatia" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IN", name: "India" },
  { code: "IS", name: "Iceland" },
  { code: "IT", name: "Italy" },
  { code: "JE", name: "Jersey" },
  { code: "JP", name: "Japan" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LK", name: "Sri Lanka" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MC", name: "Monaco" },
  { code: "MD", name: "Moldova" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MK", name: "North Macedonia" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MT", name: "Malta" },
  { code: "MX", name: "Mexico" },
  { code: "MY", name: "Malaysia" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "NZ", name: "New Zealand" },
  { code: "PH", name: "Philippines" },
  { code: "PK", name: "Pakistan" },
  { code: "PL", name: "Poland" },
  { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "PR", name: "Puerto Rico" },
  { code: "PT", name: "Portugal" },
  { code: "RE", name: "Reunion" },
  { code: "RU", name: "Russia" },
  { code: "SE", name: "Sweden" },
  { code: "SG", name: "Singapore" },
  { code: "SI", name: "Slovenia" },
  { code: "SJ", name: "Svalbard and Jan Mayen" },
  { code: "SK", name: "Slovakia" },
  { code: "SM", name: "San Marino" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" },
  { code: "US", name: "United States" },
  { code: "VA", name: "Vatican City" },
  { code: "VI", name: "U.S. Virgin Islands" },
  { code: "YT", name: "Mayotte" },
  { code: "ZA", name: "South Africa" }
].sort((a, b) => a.name.localeCompare(b.name));

export default function CountryPostcodeSearch({ onSelect }: CountryPostcodeSearchProps) {
  const [countryValue, setCountryValue] = useState("");
  const [postcodeValue, setPostcodeValue] = useState("");
  const [showCountries, setShowCountries] = useState(false);
  const [showPostcodes, setShowPostcodes] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string } | null>(null);
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [postcodeResults, setPostcodeResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(countryValue.toLowerCase()) ||
      country.code.toLowerCase().includes(countryValue.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [countryValue]);

  useEffect(() => {
    const searchPostcode = async () => {
      if (!selectedCountry || postcodeValue.length < 2) {
        setPostcodeResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.zippopotam.us/${selectedCountry.code.toLowerCase()}/${postcodeValue}`
        );
        if (response.ok) {
          const data = await response.json();
          setPostcodeResults([{
            ...data,
            country_code: selectedCountry.code
          }]);
        } else {
          setPostcodeResults([]);
        }
      } catch (error) {
        console.error("Error searching postcodes:", error);
        setPostcodeResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchPostcode, 300);
    return () => clearTimeout(debounce);
  }, [selectedCountry, postcodeValue]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Enter Country here.."
          value={countryValue}
          onChange={(e) => {
            setCountryValue(e.target.value);
            setShowCountries(true);
          }}
          onFocus={() => setShowCountries(true)}
          onBlur={() => {
            setTimeout(() => setShowCountries(false), 200);
          }}
        />
        {showCountries && (
          <div className="absolute top-full left-0 right-0 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border z-50">
            <Command>
              <CommandList className="max-h-[300px] overflow-auto">
                <CommandEmpty>No countries found.</CommandEmpty>
                <CommandGroup>
                  {filteredCountries.map((country) => (
                    <CommandItem
                      key={country.code}
                      onSelect={() => {
                        setSelectedCountry(country);
                        setCountryValue(country.name);
                        setShowCountries(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <Globe2 className="h-4 w-4" />
                        <span className="font-medium">{country.name}</span>
                        <span className="text-sm text-muted-foreground">({country.code})</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>

      {selectedCountry && (
        <div className="relative">
          <Input
            placeholder="Enter postcode here.."
            value={postcodeValue}
            onChange={(e) => {
              setPostcodeValue(e.target.value);
              setShowPostcodes(true);
            }}
            onFocus={() => setShowPostcodes(true)}
          />
          {showPostcodes && (postcodeValue.length > 0 || loading) && (
            <div className="absolute top-full left-0 right-0 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border z-50">
              <Command>
                <CommandList className="max-h-[300px] overflow-auto">
                  <CommandEmpty>
                    {loading ? (
                      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Searching postcodes...
                      </div>
                    ) : (
                      "No matching postcodes found."
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {postcodeResults.map((result, index) => (
                      <CommandItem
                        key={`${result.country_code}-${result["post code"]}-${index}`}
                        onSelect={() => {
                          onSelect(result);
                          setPostcodeValue("");
                          setShowPostcodes(false);
                        }}
                        className="p-2"
                      >
                        <div className="flex items-start gap-2 w-full">
                          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{result["post code"]}</span>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {result.places[0]["place name"]}
                              {result.places[0].state && `, ${result.places[0].state}`}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>
      )}
    </div>
  );
}