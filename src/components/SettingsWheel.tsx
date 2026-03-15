import { useState } from "react";
import styles from "./SettingsWheel.module.css";
import { SANS_FONTS, SERIF_FONTS, MONO_FONTS } from "../fonts";

interface Props {
  settings: Record<string, any>;
  onChange: (s: Record<string, any>) => void;
  onReset: () => void;
}

export default function SettingsWheel({ settings, onChange, onReset }: Props) {
  const [open, setOpen] = useState(false);

  const update = (patch: Partial<Record<string, any>>) => {
    onChange({ ...settings, ...patch });
  };

  const uiMatch = SANS_FONTS.find((f) => f.value === settings.fontUI)
    ? settings.fontUI
    : "custom";
  const serifMatch = SERIF_FONTS.find((f) => f.value === settings.fontSerif)
    ? settings.fontSerif
    : "custom";
  const monoMatch = MONO_FONTS.find((f) => f.value === settings.fontMono)
    ? settings.fontMono
    : "custom";

  return (
    <div className={styles.wheel}>
      <button
        className={styles.button}
        onClick={() => setOpen((v) => !v)}
        aria-label="Settings"
      >
        ⚙️
      </button>
      {open && (
        <div className={styles.popover} role="dialog" aria-label="UI Settings">
          <div className={styles.section}>
            <div className={styles.label}>UI Font family</div>
            <div className={styles.row}>
              <select
                className={styles.input}
                value={uiMatch}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "custom") update({});
                  else update({ fontUI: v });
                }}
                aria-label="UI font family"
              >
                {SANS_FONTS.map((f) => (
                  <option key={f.label} value={f.value}>
                    {f.label}
                  </option>
                ))}
                <option value="custom">Custom…</option>
              </select>
            </div>
            {uiMatch === "custom" && (
              <div className={styles.row} style={{ marginTop: "0.4rem" }}>
                <input
                  className={styles.input}
                  value={settings.fontUI}
                  onChange={(e) => update({ fontUI: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.label}>Serif font family</div>
            <div className={styles.row}>
              <select
                className={styles.input}
                value={serifMatch}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "custom") update({});
                  else update({ fontSerif: v });
                }}
                aria-label="Serif font family"
              >
                {SERIF_FONTS.map((f) => (
                  <option key={f.label} value={f.value}>
                    {f.label}
                  </option>
                ))}
                <option value="custom">Custom…</option>
              </select>
            </div>
            {serifMatch === "custom" && (
              <div className={styles.row} style={{ marginTop: "0.4rem" }}>
                <input
                  className={styles.input}
                  value={settings.fontSerif}
                  onChange={(e) => update({ fontSerif: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.label}>Mono font family</div>
            <div className={styles.row}>
              <select
                className={styles.input}
                value={monoMatch}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "custom") update({});
                  else update({ fontMono: v });
                }}
                aria-label="Mono font family"
              >
                {MONO_FONTS.map((f) => (
                  <option key={f.label} value={f.value}>
                    {f.label}
                  </option>
                ))}
                <option value="custom">Custom…</option>
              </select>
            </div>
            {monoMatch === "custom" && (
              <div className={styles.row} style={{ marginTop: "0.4rem" }}>
                <input
                  className={styles.input}
                  value={settings.fontMono}
                  onChange={(e) => update({ fontMono: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.label}>Base font size (px)</div>
            <div className={styles.rangeRow}>
              <input
                type="range"
                min={10}
                max={28}
                value={settings.fontBaseSize}
                onChange={(e) =>
                  update({ fontBaseSize: Math.round(Number(e.target.value)) })
                }
              />
              <input
                className={`${styles.input} ${styles.small}`}
                type="number"
                min={10}
                max={48}
                value={settings.fontBaseSize}
                onChange={(e) =>
                  update({
                    fontBaseSize: Math.round(Number(e.target.value) || 10),
                  })
                }
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.label}>Title size (px)</div>
            <div className={styles.rangeRow}>
              <input
                type="range"
                min={12}
                max={40}
                value={settings.fontTitleSize}
                onChange={(e) =>
                  update({ fontTitleSize: Number(e.target.value) })
                }
              />
              <input
                className={`${styles.input} ${styles.small}`}
                type="number"
                min={10}
                max={80}
                value={settings.fontTitleSize}
                onChange={(e) =>
                  update({ fontTitleSize: Number(e.target.value) || 12 })
                }
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.label}>Nickname size (px)</div>
            <div className={styles.rangeRow}>
              <input
                type="range"
                min={8}
                max={24}
                value={settings.fontNicknameSize}
                onChange={(e) =>
                  update({ fontNicknameSize: Number(e.target.value) })
                }
              />
              <input
                className={`${styles.input} ${styles.small}`}
                type="number"
                min={8}
                max={32}
                value={settings.fontNicknameSize}
                onChange={(e) =>
                  update({ fontNicknameSize: Number(e.target.value) || 8 })
                }
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.label}>Bio size (px)</div>
            <div className={styles.rangeRow}>
              <input
                type="range"
                min={10}
                max={28}
                value={settings.fontBioSize}
                onChange={(e) =>
                  update({ fontBioSize: Number(e.target.value) })
                }
              />
              <input
                className={`${styles.input} ${styles.small}`}
                type="number"
                min={10}
                max={48}
                value={settings.fontBioSize}
                onChange={(e) =>
                  update({ fontBioSize: Number(e.target.value) || 10 })
                }
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.label}>Canvas node label base (px)</div>
            <div className={styles.rangeRow}>
              <input
                type="range"
                min={8}
                max={28}
                value={settings.nodeLabelBase}
                onChange={(e) =>
                  update({ nodeLabelBase: Number(e.target.value) })
                }
              />
              <input
                className={`${styles.input} ${styles.small}`}
                type="number"
                min={6}
                max={48}
                value={settings.nodeLabelBase}
                onChange={(e) =>
                  update({ nodeLabelBase: Number(e.target.value) || 8 })
                }
              />
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.saveHint}>Saved automatically</div>
            <div>
              <button
                className={styles.resetBtn}
                onClick={() => {
                  onReset();
                  setOpen(false);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
