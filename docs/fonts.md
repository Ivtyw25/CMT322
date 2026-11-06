# Bundled fonts

`src/styles/fonts.ts` uses `next/font/local` so production builds need no Google Fonts connection. Font variables, normal style, `display: swap`, and the existing design weights are unchanged: Poppins 300/600/700 and Inter 400/500/600.

The WOFF2 files are unmodified Latin assets recovered from this project's existing Next.js Google Fonts development cache on 3 November 2026. They were identified using Next.js's bundled font parser and cached `@font-face` CSS. The Poppins files are version 4.004; Inter is version 4.001 (`git-66647c0bb`), a variable font with a 100–900 weight axis. Its local declaration exposes the used 400–600 range. Only the Latin subset selected by the original configuration is bundled; adding other writing systems requires the corresponding font subsets.

| Bundled file | Original cache file | Identification |
| --- | --- | --- |
| `poppins-latin-300.woff2` | `c875c6f5d3e977ac-s.p.1h18_wedhzk4h.woff2` | Poppins-Light, 218 glyphs |
| `poppins-latin-600.woff2` | `e2334d715941921e-s.p.3o_v2fun1jzxk.woff2` | Poppins-SemiBold, 218 glyphs |
| `poppins-latin-700.woff2` | `47fe1b7cd6e6ed85-s.p.3bh2vc0w-r-ll.woff2` | Poppins-Bold, 218 glyphs |
| `inter-latin-variable.woff2` | `83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2` | Inter-Regular, weight axis 100–900, 518 glyphs |

The assets retain their embedded copyright and Open Font License metadata. Full SIL Open Font License 1.1 notices are included alongside them in `src/assets/fonts/OFL-Poppins.txt` and `OFL-Inter.txt`. The Inter notice retains the cached font's 2016 copyright and the upstream notice's 2020 copyright.

License sources: [Poppins in the Google Fonts repository](https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/OFL.txt), [Inter in the Google Fonts repository](https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt). Source projects: [Poppins](https://github.com/itfoundry/Poppins), [Inter](https://github.com/rsms/inter).

No font binaries were regenerated or substituted. Production build and browser checks belong to the final integration pass; earlier screenshots made with fallback fonts must be re-measured.
