// src/pages/Legal.tsx
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

/*************************
 ****** SHARED LAYOUT *****
 *************************/

interface LegalLayoutProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, updated, children }) => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ "--background": "var(--cc-bg)", "--border-color": "var(--cc-border)" } as React.CSSProperties}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
            <IonButton fill="clear" onClick={() => history.goBack()} style={{ "--color": "var(--cc-text)" } as React.CSSProperties}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
            <IonTitle style={{ "--color": "var(--cc-text)" } as React.CSSProperties}>{title}</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ "--background": "var(--cc-bg)" } as React.CSSProperties}>
        <div className="px-6 pt-2 pb-16 max-w-2xl mx-auto">
          <p className="text-xs mb-6" style={{ color: "var(--cc-text-tertiary)" }}>
            Last updated: {updated}
          </p>
          <div
            className="flex flex-col gap-6"
            style={{ color: "var(--cc-text-secondary)", fontSize: "14.5px", lineHeight: 1.65 }}
          >
            {children}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const Section: React.FC<{ heading: string; children: React.ReactNode }> = ({ heading, children }) => (
  <section>
    <h2 className="text-base font-bold mb-2" style={{ color: "var(--cc-text)" }}>
      {heading}
    </h2>
    <div className="flex flex-col gap-2">{children}</div>
  </section>
);

/*************************
 ******* TERMS PAGE *******
 *************************/

export const TermsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <LegalLayout title={t("legal.termsTitle")} updated="September 2026">
      <p>
        Oakwood Compass (also referred to as Campus Connect) is a student-built,
        beta app maintained by the Oakwood University Computer Science Club. By
        using the app, you agree to the terms below.
      </p>

      <Section heading="1. The app is provided as-is">
        <p>
          Oakwood Compass is an independent, student-run project and is not an
          official service of Oakwood University. Building hours, event
          listings, directions, and other information are provided for
          convenience and may occasionally be inaccurate or out of date. Always
          confirm important details (like office hours or event times) with the
          department or organizer directly.
        </p>
      </Section>

      <Section heading="2. Beta software">
        <p>
          The app is under active development. Features may change, break, or
          be temporarily unavailable, and your saved data (such as favorites)
          could occasionally be reset as we make improvements. We'll do our
          best to avoid data loss, but can't guarantee it during the beta
          period.
        </p>
      </Section>

      <Section heading="3. Guest and account use">
        <p>
          You can use most of the app as a guest without creating an account.
          Signing in with Google unlocks syncing your favorites across
          devices. You're responsible for keeping access to your own Google
          account secure.
        </p>
      </Section>

      <Section heading="4. Acceptable use">
        <p>
          Please don't misuse the app — that includes attempting to disrupt
          its normal operation, scraping data at scale, or submitting false
          reports through the in-app issue reporter.
        </p>
      </Section>

      <Section heading="5. Changes">
        <p>
          We may update these terms as the app evolves. Continued use of the
          app after a change means you accept the updated terms.
        </p>
      </Section>

      <Section heading="6. Contact">
        <p>
          Questions about these terms? Reach out to the Oakwood University
          Computer Science Club, or use "Give Feedback" from the Info tab in
          the app.
        </p>
      </Section>
    </LegalLayout>
  );
};

/*************************
 ****** PRIVACY PAGE ******
 *************************/

export const PrivacyPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <LegalLayout title={t("legal.privacyTitle")} updated="September 2026">
      <p>
        This page explains what information Oakwood Compass collects and how
        it's used. We try to collect as little as possible.
      </p>

      <Section heading="1. Information we collect">
        <p>As a guest, we store locally on your device:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Your favorited campus locations</li>
          <li>Your selected language and appearance (dark/light) preferences</li>
          <li>Whether you've completed the first-time app tour</li>
        </ul>
        <p>If you sign in with Google, we additionally store:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Your name, email address, and profile picture, as provided by Google</li>
          <li>Your favorited locations, synced to your account so they're available across devices</li>
        </ul>
      </Section>

      <Section heading="2. Location data">
        <p>
          If you use in-app navigation or "Find Me" on the map, your device's
          location is used locally to show your position and give directions.
          We don't store or transmit your location to our servers.
        </p>
      </Section>

      <Section heading="3. How we use information">
        <p>
          Account information is used only to sign you in and sync your
          favorites. We don't sell your data, show ads, or share your
          information with third parties beyond the services that power the
          app (Google Sign-In and Firebase for authentication and storage,
          Mapbox for maps).
        </p>
      </Section>

      <Section heading="4. Issue reports">
        <p>
          If you submit an issue report from a location listing, the
          description you write is sent to the CS Club team so we can look
          into it. Please avoid including personal information in a report
          unless it's necessary to describe the issue.
        </p>
      </Section>

      <Section heading="5. Your choices">
        <p>
          You can use the app as a guest at any time without signing in. You
          can clear your favorites and preferences by logging out, or by
          clearing your browser/app storage. To request deletion of your
          account data, contact the CS Club team.
        </p>
      </Section>

      <Section heading="6. Changes">
        <p>
          We may update this policy as the app evolves. We'll update the date
          at the top of this page when we do.
        </p>
      </Section>

      <Section heading="7. Contact">
        <p>
          Questions about this policy? Reach out to the Oakwood University
          Computer Science Club, or use "Give Feedback" from the Info tab in
          the app.
        </p>
      </Section>
    </LegalLayout>
  );
};