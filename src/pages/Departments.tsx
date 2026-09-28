import { IonContent, IonPage, IonText, IonButton } from "@ionic/react";
import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import TabBar from "../components/navigation/TabBar";
import { departments, schools, Department } from "../types/departments";
import { campusLocations } from "../types/locations";
import { openDirections } from "../utils";
import { useLanguage } from "../contexts/LanguageContext";

/*************************
 ******** HELPERS ********
 *********************** */

const getBuilding = (dept: Department) =>
  dept.locationId ? campusLocations.find((l) => l.id === dept.locationId) : undefined;

const getSchool = (dept: Department) => schools.find((s) => s.id === dept.school);

const buttonStyle = {
  "--background": "var(--cc-surface-3)",
  "--background-activated": "var(--cc-border-strong)",
  "--color": "var(--cc-text)",
  "--border-radius": "12px",
  "--border-width": "1px",
  "--border-style": "solid",
  "--border-color": "var(--cc-border-strong)",
  "--padding-top": "8px",
  "--padding-bottom": "8px",
  minHeight: "38px",
  fontSize: "13px",
  fontWeight: "600",
} as React.CSSProperties;

/*************************
 ******** DEPARTMENTS PAGE ********
 *********************** */

const DepartmentsPage: React.FC = () => {
  const { t } = useLanguage();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((d) =>
      [d.name, d.note, getSchool(d)?.name, d.chair.name, getBuilding(d)?.name]
        .some((field) => field?.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  // Group by school, in the order schools are listed in departments.ts
  const grouped = useMemo(
    () =>
      schools
        .map((school) => ({ school, depts: filtered.filter((d) => d.school === school.id) }))
        .filter((g) => g.depts.length > 0),
    [filtered],
  );

  const showOnMap = (locationId: string) =>
    history.push({
      pathname: "/home",
      search: `?highlight=${locationId}`,
      state: { highlight: locationId, showSaveTip: false },
    });

  /*************************
   ******** RENDER CARD ********
   *********************** */

  const renderDepartmentCard = (dept: Department, i: number, groupIndex: number) => {
    const building = getBuilding(dept);
    return (
      <div
        key={dept.id}
        className="fade-up rounded-2xl p-4"
        style={{
          animationDelay: `${groupIndex * 0.07 + i * 0.04}s`,
          background: "var(--cc-surface-2)",
          border: "1px solid var(--cc-border-strong)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        }}
      >
        {/* Department name */}
        <IonText>
          <h2 className="text-lg font-bold leading-snug" style={{ color: "var(--cc-text)" }}>
            {dept.name}
          </h2>
        </IonText>
        {dept.note && (
          <p className="text-sm mt-1" style={{ color: "var(--cc-text-secondary)" }}>
            {dept.note}
          </p>
        )}

        <div className="h-px my-3" style={{ background: "var(--cc-border-strong)" }} />

        {/* Chair */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <span className="text-lg leading-none mt-0.5">👤</span>
          <div>
            <p className="text-[15px] font-semibold" style={{ color: "var(--cc-text)" }}>
              {dept.chair.name}
            </p>
            <p className="text-sm" style={{ color: "var(--cc-text-secondary)" }}>
              {dept.chair.title ?? t("departments.chair")}
            </p>
          </div>
        </div>

        {dept.chair.email && (
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-lg leading-none">✉️</span>
            <a
              href={`mailto:${dept.chair.email}`}
              className="text-[15px] font-medium break-all"
              style={{ color: "#e8b341" }}
            >
              {dept.chair.email}
            </a>
          </div>
        )}

        {dept.chair.phone && (
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-lg leading-none">📞</span>
            <a
              href={`tel:${dept.chair.phone}`}
              className="text-[15px] font-medium"
              style={{ color: "#e8b341" }}
            >
              {dept.chair.phone}
            </a>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="text-lg leading-none">📍</span>
          <span className="text-[15px]" style={{ color: "var(--cc-text-secondary)" }}>
            {building?.name ?? t("departments.locationTBD")}
            {dept.office ? ` · ${t("departments.office")} ${dept.office}` : ""}
          </span>
        </div>

        {building && (
          <div className="flex gap-2">
            <IonButton
              className="flex-1"
              expand="block"
              onClick={() => showOnMap(building.id)}
              style={buttonStyle}
            >
              📍 {t("departments.viewOnMap")}
            </IonButton>
            <IonButton
              className="flex-1"
              expand="block"
              onClick={() => openDirections(building.lat, building.lng)}
              style={buttonStyle}
            >
              🗺️ {t("departments.directions")}
            </IonButton>
          </div>
        )}
      </div>
    );
  };

  /*************************
   ******** RENDER ********
   *********************** */

  return (
    <IonPage>
      <IonContent fullscreen>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
          .dept-search::placeholder { color: var(--cc-text-tertiary); }
        `}</style>

        <div className="px-4 md:px-8 pt-6 pb-32 max-w-5xl mx-auto">

          {/* Header */}
          <div className="fade-up mb-6 px-1">
            <IonText>
              <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--cc-text)" }}>
                {t("departments.title")}
              </h1>
            </IonText>
            <p className="text-base mt-1" style={{ color: "var(--cc-text-secondary)" }}>
              Oakwood University
            </p>
          </div>

          {/* Search box */}
          <div className="fade-up mb-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("departments.searchPlaceholder")}
              className="dept-search w-full rounded-xl pl-4 pr-10 py-3 text-base focus:outline-none"
              style={{
                color: "var(--cc-text)",
                backgroundColor: "var(--cc-surface-2)",
                border: "1px solid var(--cc-border-strong)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base"
                style={{ color: "var(--cc-text-secondary)" }}
              >
                ✕
              </button>
            )}
          </div>

          {grouped.length === 0 && (
            <div className="text-center py-10">
              <p className="text-base" style={{ color: "var(--cc-text-secondary)" }}>
                {t("departments.noResults")}
              </p>
            </div>
          )}

          {/* Departments grouped by school */}
          {grouped.map(({ school, depts }, groupIndex) => (
            <div
              key={school.id}
              className="fade-up mb-8"
              style={{ animationDelay: `${groupIndex * 0.07}s` }}
            >
              <div className="flex items-center gap-3 mb-4 px-1">
                <span className="text-2xl leading-none">{school.icon}</span>
                <h2 className="text-lg font-bold" style={{ color: "#e8b341" }}>
                  {school.name}
                </h2>
                <div className="flex-1 h-px" style={{ background: "var(--cc-border-strong)" }} />
                <span className="text-sm" style={{ color: "var(--cc-text-secondary)" }}>
                  {depts.length}
                </span>
              </div>

              <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {depts.map((d, i) => renderDepartmentCard(d, i, groupIndex))}
              </div>
            </div>
          ))}
        </div>
      </IonContent>

      <TabBar />
    </IonPage>
  );
};

export default DepartmentsPage;
