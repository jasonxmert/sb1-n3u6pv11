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
import { MapPin, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationAutocompleteProps {
  onSelect: (result: any) => void;
}

// Extended city data with more cities and better organization
const cityData = {
  // Major global cities with their postal codes
  "london": { country: "GB", name: "London", codes: ["E1", "EC1", "N1", "NW1", "SE1", "SW1", "W1", "WC1"] },
  "paris": { country: "FR", name: "Paris", codes: ["75001", "75002", "75003", "75004", "75005"] },
  "new york": { country: "US", name: "New York", codes: ["10001", "10002", "10003", "10004", "10005"] },
  "tokyo": { country: "JP", name: "Tokyo", codes: ["100-0001", "100-0002", "100-0003", "100-0004"] },
  "berlin": { country: "DE", name: "Berlin", codes: ["10115", "10117", "10119", "10178", "10179"] },
  "sydney": { country: "AU", name: "Sydney", codes: ["2000", "2001", "2002", "2010", "2011"] },
  "toronto": { country: "CA", name: "Toronto", codes: ["M5A", "M5B", "M5C", "M5E", "M5G"] },
  "singapore": { country: "SG", name: "Singapore", codes: ["048617", "048618", "048619", "048620"] },
  "dubai": { country: "AE", name: "Dubai", codes: ["00000"] }, // Dubai uses a different system
  "hong kong": { country: "HK", name: "Hong Kong", codes: ["999077"] },
  "mumbai": { country: "IN", name: "Mumbai", codes: ["400001", "400002", "400003", "400004"] },
  "sao paulo": { country: "BR", name: "São Paulo", codes: ["01000-000", "01001-000", "01002-000"] },
  // Add more major cities as needed
};

export default function LocationAutocomplete({ onSelect }: LocationAutocompleteProps) {
  const [value, setValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ city: string; country: string; name: string; codes: string[] }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (value.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const searchTerm = value.toLowerCase();
    const matchingCities = Object.entries(cityData)
      .filter(([city]) => city.includes(searchTerm))
      .map(([city, data]) => ({
        city,
        country: data.country,
        name: data.name,
        codes: data.codes
      }));

    setResults(matchingCities);
    setLoading(false);
  }, [value]);

  const handleSelect = async (city: string, countryCode: string, postcode: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.zippopotam.us/${countryCode.toLowerCase()}/${postcode}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch location data for ${city}`);
      }
      
      const data = await response.json();
      onSelect(data);
      setValue("");
      setShowResults(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch location details. Please try again.",
        variant: "destructive",
      });
      console.error("Error fetching location details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder="Search for a city (e.g., London, Paris, New York)..."
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
                    Searching locations...
                  </div>
                ) : (
                  "No matching locations found."
                )}
              </CommandEmpty>
              <CommandGroup>
                {results.map((result) => (
                  <CommandItem
                    key={`${result.city}-${result.country}`}
                    onSelect={() => handleSelect(result.city, result.country, result.codes[0])}
                    className="p-2"
                  >
                    <div className="flex items-start gap-2 w-full">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{result.name}</span>
                          <span className="text-sm text-muted-foreground">{result.country}</span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          Sample postcodes: {result.codes.slice(0, 3).join(", ")}
                          {result.codes.length > 3 && "..."}
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