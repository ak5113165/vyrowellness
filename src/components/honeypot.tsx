import { forwardRef } from "react";

/**
 * Spam trap: a text field people never see (off-screen, skipped by keyboard and
 * screen readers) but simple bots fill in. Forms check it before sending and
 * quietly drop the submission if it has a value.
 */
export const Honeypot = forwardRef<HTMLInputElement>(function Honeypot(_props, ref) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Leave this field empty
        <input ref={ref} type="text" name="company_url" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
});
