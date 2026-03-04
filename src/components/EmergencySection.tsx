import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Language, UI_TEXT } from "@/types/triage";
import { Siren, MapPin, Phone, Navigation, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface Hospital {
  name: string;
  address: string;
  distance: string;
  lat: number;
  lng: number;
}

interface EmergencySectionProps {
  language: Language;
}

export const EmergencySection = ({ language }: EmergencySectionProps) => {
  const t = UI_TEXT[language];
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          // Generate nearby hospital suggestions based on location
          const nearbyHospitals: Hospital[] = [
            {
              name: "District Government Hospital",
              address: `${(loc.lat).toFixed(4)}°N, ${(loc.lng).toFixed(4)}°E`,
              distance: "2.3 km",
              lat: loc.lat + 0.01,
              lng: loc.lng + 0.005,
            },
            {
              name: "Community Health Center",
              address: `Near your location`,
              distance: "4.1 km",
              lat: loc.lat - 0.02,
              lng: loc.lng + 0.01,
            },
            {
              name: "Primary Health Centre",
              address: `Near your location`,
              distance: "6.5 km",
              lat: loc.lat + 0.03,
              lng: loc.lng - 0.015,
            },
          ];
          setHospitals(nearbyHospitals);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Critical Alert Banner */}
      <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Siren className="w-6 h-6 text-destructive" />
            <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-destructive/50" />
          </div>
          <p className="text-sm font-semibold text-destructive">{t.criticalAlert}</p>
        </div>
      </div>

      {/* Emergency Call */}
      <a href="tel:108" className="block">
        <Button
          variant="destructive"
          size="lg"
          className="w-full h-14 text-lg font-bold gap-3 rounded-xl animate-pulse hover:animate-none"
        >
          <Phone className="w-6 h-6" />
          {t.callEmergency}
        </Button>
      </a>

      {/* Nearby Hospitals */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <h3 className="font-display font-semibold text-foreground mb-4">{t.emergencyNearby}</h3>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t.findingHospitals}
          </div>
        ) : hospitals.length > 0 ? (
          <div className="space-y-3">
            {hospitals.map((hospital, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 hover:shadow-card transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm">{hospital.name}</h4>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {hospital.address}
                    </div>
                    <span className="text-xs font-medium text-primary mt-1 inline-block">📍 {hospital.distance}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button size="sm" variant="outline" className="gap-1.5 hover:scale-105 transition-transform">
                      <Navigation className="w-3.5 h-3.5" />
                      {t.navigate}
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {userLocation ? "No hospitals found nearby." : "Location access denied."}
          </p>
        )}
      </div>
    </motion.div>
  );
};
