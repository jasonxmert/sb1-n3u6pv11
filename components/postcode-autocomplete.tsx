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
import { MapPin, Globe2, Building2 } from "lucide-react";

interface PostcodeAutocompleteProps {
  onSelect: (result: any) => void;
  placeholder?: string;
}

export default function PostcodeAutocomplete({ onSelect, placeholder = "Enter postcode here.." }: PostcodeAutocompleteProps) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchPostcode = async () => {
      if (value.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const countries = ["US", "GB", "CA", "AU", "DE", "FR", "IT", "ES", "NL", "BE", "CH", "AT"];
        const searches = countries.map(async (country) => {
          try {
            const response = await fetch(
              `https://api.zippopotam.us/${country.toLowerCase()}/${value}`
            );
            if (response.ok) {
              const data = await response.json();
              return {
                ...data,
                country_code: country,
              };
            }
          } catch (error) {
            return null;
          }
        });

        const results = (await Promise.all(searches)).filter(Boolean);
        setResults(results);
      } catch (error) {
        console.error("Error searching postcodes:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchPostcode, 300);
    return () => clearTimeout(debounce);
  }, [value]);

  return (
    <div className="relative w-full">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        className="w-full"
      />
      {showResults && (value.length > 0 || loading) && (
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
                {results.map((result, index) => (
                  <CommandItem
                    key={`${result.country_code}-${result["post code"]}-${index}`}
                    onSelect={() => {
                      onSelect(result);
                      setValue("");
                      setShowResults(false);
                    }}
                    className="p-2"
                  >
                    <div className="flex items-start gap-2 w-full">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{result["post code"]}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Globe2 className="h-3 w-3" />
                            {result.country}
                          </span>
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
  );
}