-- Show only what United Sports sells (unitedsports.lk), plus the Elevate rackets arriving from the
-- latest Diadem order (src/data/arriving-soon.ts). The rest of Diadem's range stays in the table,
-- unpublished, so it can be switched back on from /admin → Products.
update public.products
   set published = false, updated_at = now()
 where id like 'dd-%'
   and id not in ('dd-7575939907666', 'dd-7030357426258-teal');

-- Elevate V4 Team 98 (arriving soon): Diadem's current colour copy and full specifications.
update public.products set description = '["The Diadem Elevate V4 ushers in a new era to the flagship series’ most maneuverable and user-friendly frame. This update features a captivating design paired with unique technology to provide a more arm friendly and comfortable feel.","The headliner innovation, Kraibon, manages to increase both the flexibility and stability of the frame without sacrificing power. The ultimate control racket lends supreme feel for the ball on every shot. The racket still utilizes the FS system from the previous model as well as our high density foam and HMT carbon.","The Elevate rewards aggressive, precise ball-strikers who like to create their own power with a blend of feel, stability, and comfort in a 16x20 string bed pattern. Wow your opponents and teammates with a beautiful metallic green colorway and gloss paint finish."]'::jsonb, specs = '[{"label":"Head Size","value":"98 sq in"},{"label":"Weight","value":"10.2 oz / 290 g"},{"label":"Length","value":"27 in"},{"label":"Balance","value":"3 pts HL / 335 mm"},{"label":"Stiffness","value":"64 RA"},{"label":"String Pattern","value":"16 x 20"},{"label":"Beam","value":"21.5 mm Flat Beam"},{"label":"Colour","value":"Metallic green, gloss finish"}]'::jsonb, updated_at = now() where id = 'dd-7575939907666';
