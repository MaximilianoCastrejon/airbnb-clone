const paths = {
  LOGO_BLACK:
    'M224 373.12c-25.24-31.67-40.08-59.43-45-83.18-22.55-88 112.61-88 90.06 0-5.45 24.25-20.29 52-45 83.18zm138.15 73.23c-42.06 18.31-83.67-10.88-119.3-50.47 103.9-130.07 46.11-200-18.85-200-54.92 0-85.16 46.51-73.28 100.5 6.93 29.19 25.23 62.39 54.43 99.5-32.53 36.05-60.55 52.69-85.15 54.92-50 7.43-89.11-41.06-71.3-91.09 15.1-39.16 111.72-231.18 115.87-241.56 15.75-30.07 25.56-57.4 59.38-57.4 32.34 0 43.4 25.94 60.37 59.87 36 70.62 89.35 177.48 114.84 239.09 13.17 33.07-1.37 71.29-37.01 86.64zm47-136.12C280.27 35.93 273.13 32 224 32c-45.52 0-64.87 31.67-84.66 72.79C33.18 317.1 22.89 347.19 22 349.81-3.22 419.14 48.74 480 111.63 480c21.71 0 60.61-6.06 112.37-62.4 58.68 63.78 101.26 62.4 112.37 62.4 62.89.05 114.85-60.86 89.61-130.19.02-3.89-16.82-38.9-16.82-39.58z',
  MAGNIFYING_GLASS_WHITE:
    'M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z',
  HAMBURGER_ICON:
    'M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z',
  USER_ICON:
    'M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z',
  HOSTING_HOME:
    'M13.92 1.11a3 3 0 0 1 4.02-.13l.14.13 11.3 10.87a2 2 0 0 1 .61 1.26l.01.18V27a3 3 0 0 1-2.82 3H5a3 3 0 0 1-3-2.82V13.43a2 2 0 0 1 .49-1.31l.12-.13L13.92 1.1zm2.77 1.44a1 1 0 0 0-1.29-.08l-.1.08L4 13.43V27a1 1 0 0 0 .88 1H27a1 1 0 0 0 1-.88V13.43L16.7 2.55zM22 12.6 23.41 14 14 23.41 8.59 18 10 16.59l4 4 8-8z',
  CALENDAR:
    'M28 2h-6V0h-2v2h-8V0h-2v2H4a2 2 0 0 0-2 2v21a5 5 0 0 0 5 5h12.59a2.01 2.01 0 0 0 1.41-.59L29.41 21a2.01 2.01 0 0 0 .59-1.41V4a2 2 0 0 0-2-2Zm-8 25.59V23a3 3 0 0 1 3-3h4.59ZM28 10H4v2h24v6h-5a5 5 0 0 0-5 5v5H7a3 3 0 0 1-3-3V4h6v2h2V4h8v2h2V4h6Z',
  LISTINGS:
    'm30.6557454.56112368.6885092 1.87775264-2.3445092.85824736.0002546 24.70287632c0 1.1045695-.8954305 2-2 2h-22c-1.1045695 0-2-.8954305-2-2l-.00025465-15.1688763-1.6554907.6077526-.6885093-1.8777526 2.344-.859.00025465-7.7021237h2l-.00025465 6.96812368zm-3.656 3.47-22.00000005 8.06600002.00025465 15.9028763h6v-10c0-1.1045695.8954305-2 2-2h6c1.1045695 0 2 .8954305 2 2v10h6zm-7.9997454 13.96887632h-6v10h6zm4-9c.5522847 0 1 .44771525 1 1 0 .5522847-.4477153 1-1 1s-1-.4477153-1-1c0-.55228475.4477153-1 1-1z',
  CHAT_BUBBLE:
    'M16 31.08 11.84 26H6a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5h-5.85ZM6 4a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h6.8l3.2 3.92L19.2 24H26a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Z',
  RESERVATIONS:
    'M26 6h-4V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v2H6a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h20a5 5 0 0 0 5-5V11a5 5 0 0 0-5-5zM12 4h8v2h-8zM6 28a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3h4v20zm6 0V8h8v20zm17-3a3 3 0 0 1-3 3h-4V8h4a3 3 0 0 1 3 3z',
  EARNINGS:
    'M25 4a2 2 0 0 1 2 1.85V8h2.04c1.04 0 1.88.82 1.96 1.85V26c0 1.05-.8 1.92-1.81 2H6.96a1.98 1.98 0 0 1-1.95-1.85L5 26v-2H3a2 2 0 0 1-2-1.85V6a2 2 0 0 1 1.85-2H3zm2 18a2 2 0 0 1-1.85 2H7v2h22V10h-2zM25 6H3v16h22zm-3 12a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-8-8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
  INSIGHTS:
    'M27 5h-4a2 2 0 0 0-2 2v4h-4V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v8H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM9 29H5V13h4zm6 0h-4V3h4zm6 0h-4V13h4zm6 0h-4V7h4z',
  GUIDEBOOK:
    'M1.67 2.68A2 2 0 0 1 4.1.72l.14.04L16.01 4.3 27.78.91a2 2 0 0 1 2.53 1.63l.02.14v23.25a2 2 0 0 1-1.27 1.85l-.15.06-12.62 3.78a1 1 0 0 1-.46.03l-.12-.03L3.1 27.84a2 2 0 0 1-1.42-1.75v-.17zm2 0v23.24L16 29.62l12.33-3.7V2.82L16.28 6.3a1 1 0 0 1-.46.03l-.1-.03zm21.66 17.48v2.08L16 25.04v-2.08zm0-6v2.08L16 19.04v-2.08zm0-6v2.08L16 13.04v-2.08z',
  PROFILE:
    'M16 1a15 15 0 1 0 15 15A15.02 15.02 0 0 0 16 1zM6.92 25.28a10.93 10.93 0 0 1 7.08-4.6v-2.11a5 5 0 1 1 4 0v2.12a10.93 10.93 0 0 1 7.08 4.6 12.96 12.96 0 0 1-18.16 0zm19.5-1.55a12.9 12.9 0 0 0-5.87-4.41 7 7 0 1 0-9.1 0 12.91 12.91 0 0 0-5.88 4.4A13 13 0 1 1 29 16a12.91 12.91 0 0 1-2.57 7.73z',
  SETTINGS:
    'M19.38 27a4.14 4.14 0 0 1 3.05-2.54 4.06 4.06 0 0 1 3.17.71 1 1 0 0 0 1.47-.33l2.11-3.64a1 1 0 0 0-.46-1.44 4.1 4.1 0 0 1 0-7.48 1 1 0 0 0 .46-1.44l-2.11-3.66a1 1 0 0 0-1.47-.33 4.07 4.07 0 0 1-3.17.71A4.14 4.14 0 0 1 19.38 5a4 4 0 0 1-.27-1.87 1 1 0 0 0-1-1.15h-4.2a1 1 0 0 0-1 1.15 4.11 4.11 0 0 1-3.34 4.43 4.06 4.06 0 0 1-3.17-.71 1 1 0 0 0-1.47.33l-2.11 3.64a1 1 0 0 0 .46 1.44 4.1 4.1 0 0 1 0 7.48 1 1 0 0 0-.46 1.44l2.11 3.64a1 1 0 0 0 1.47.33 4.06 4.06 0 0 1 3.17-.71 4.1 4.1 0 0 1 3 2.53 4 4 0 0 1 .28 1.88 1 1 0 0 0 1 1.15h4.18a1 1 0 0 0 1-1.15 4 4 0 0 1 .35-1.85zM12 16a4 4 0 1 1 4 4 4 4 0 0 1-4-4z',
  NOTIFICATION:
    'm17 1 .0001009 2.04938529c5.0532743.50177151 8.9998991 4.765307 8.9998991 9.95071081l-.0017211 7.1849039 2.6238637 3.6469846c.1627256.2261823.2758911.48315.3366058.7901878l.0301116.1903853.0097863.1874423c0 1.1045695-.8954305 2-2 2h-7.3324683l.0004887.3333333c0 2.0250441-1.6416226 3.6666667-3.6666667 3.6666667s-3.6666667-1.6416226-3.6666667-3.6666667l-.0001553-.3333333h-7.33182434c-.4191735 0-.82775206-.1317032-1.16801537-.3765037-.89663222-.6450771-1.10055797-1.8948794-.45559816-2.7913486l2.62153872-3.6461477.00082568-7.2004584.00415152-.2798473c.14655887-5.06150988 4.04689595-9.16391295 8.99477955-9.65616465l.0009644-2.04952965zm.666178 26h-3.333l.0001553.3333333c0 .9204746.7461921 1.6666667 1.6666667 1.6666667s1.6666667-.7461921 1.6666667-1.6666667zm-1.666178-22c-4.3303084 0-7.87156533 3.44605088-7.99626742 7.7490961l-.00373258.2509999-.00075209 7.831181-2.99789425 4.168723h21.99692524l-2.999031-4.1697417.0007521-7.8302583c0-4.418278-3.581722-8-8-8z',
  REFERAL:
    'M32 25h-2a8 8 0 0 0-7-7.93v-2.25a3 3 0 1 0-2 0v2.25a7.96 7.96 0 0 0-3.5 1.33A9.95 9.95 0 0 1 20 25h-2a7.95 7.95 0 0 0-2-5.28 8.06 8.06 0 0 0-1.5-1.32 7.96 7.96 0 0 0-3.5-1.33v-2.25a3 3 0 1 0-2 0v2.25A8 8 0 0 0 2 25H0a10.02 10.02 0 0 1 6.55-9.39 5 5 0 1 1 6.9 0 9.98 9.98 0 0 1 2.55 1.4 9.98 9.98 0 0 1 2.55-1.4 5 5 0 1 1 6.9 0A10.02 10.02 0 0 1 32 25Z',
  ADD_LISTING:
    'M31.7 15.3 29 12.58 18.12 1.7a3.07 3.07 0 0 0-4.24 0L3 12.59l-2.7 2.7 1.4 1.42L3 15.4V28a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V15.41l1.3 1.3ZM27 28H5V13.41L15.3 3.12a1 1 0 0 1 1.4 0L27 13.42ZM17 12v5h5v2h-5v5h-2v-5h-5v-2h5v-5Z',
  INBOX:
    'M26 1a5 5 0 0 1 5 4.78v10.9a5 5 0 0 1-4.78 5H26a5 5 0 0 1-4.78 5h-4l-3.72 4.36-3.72-4.36H6a5 5 0 0 1-4.98-4.56L1 21.9 1 21.68V11a5 5 0 0 1 4.78-5H6a5 5 0 0 1 4.78-5H26zm-5 7H6a3 3 0 0 0-3 2.82v10.86a3 3 0 0 0 2.82 3h4.88l2.8 3.28 2.8-3.28H21a3 3 0 0 0 3-2.82V11a3 3 0 0 0-3-3zm-1 10v2H6v-2h14zm6-15H11a3 3 0 0 0-3 2.82V6h13a5 5 0 0 1 5 4.78v8.9a3 3 0 0 0 3-2.82V6a3 3 0 0 0-2.82-3H26zM15 13v2H6v-2h9z',
  RESOURCES:
    'M25 3a2 2 0 0 1 2 1.85V7h2a2 2 0 0 1 2 1.85V26a3 3 0 0 1-3 3H4a3 3 0 0 1-3-2.82V5a2 2 0 0 1 1.85-2H3zm4 6h-2v17a1 1 0 0 0 2 .12V26zm-4-4H3v21a1 1 0 0 0 .88 1H25zM13 21v2H7v-2zm8 0v2h-6v-2zm-8-4v2H7v-2zm8 0v2h-6v-2zm0-8v6H7V9zm-2 2H9v2h10z',
  HELP_CENTER:
    'M16 1a15 15 0 1 0 15 15A15.02 15.02 0 0 0 16 1zm0 28a13 13 0 1 1 13-13 13.01 13.01 0 0 1-13 13zm1.5-5.5A1.5 1.5 0 1 1 16 22a1.5 1.5 0 0 1 1.5 1.5zM21.58 12c0 2.53-1.7 4.58-4.57 5.59L17 20h-2l.01-3.91.74-.2c1.15-.32 3.83-1.32 3.83-3.89a3.19 3.19 0 0 0-3.45-3.17 3.68 3.68 0 0 0-3.53 2.72L10.67 11a5.66 5.66 0 0 1 5.46-4.17A5.2 5.2 0 0 1 21.58 12z',
  RED_CROSS_SHIELD:
    'm16 .8.56.37C20.4 3.73 24.2 5 28 5h1v12.5C29 25.57 23.21 31 16 31S3 25.57 3 17.5V5h1c3.8 0 7.6-1.27 11.45-3.83L16 .8zm0 2.4-.34.2a22.58 22.58 0 0 1-10.3 3.55L5 6.97V17.5C5 24.33 9.72 28.86 15.71 29H16c6.13 0 11-4.56 11-11.5V6.97l-.35-.02a22.58 22.58 0 0 1-10.31-3.54L16 3.19zM20 8v4h4v8h-4v4h-8v-4H8v-8h4V8h8zm-2 2h-4v4h-4v4h4v4h4v-4h4v-4h-4v-4z',
  LINE_GLOBE:
    'M16 1a15 15 0 1 1 0 30 15 15 0 0 1 0-30zm4.4 21h-8.8c.89 4.18 2.63 7 4.4 7 1.77 0 3.51-2.82 4.4-7zM9.55 22H4.46a13.04 13.04 0 0 0 7.48 6.35A17.63 17.63 0 0 1 9.55 22zm17.98 0h-5.08a17.62 17.62 0 0 1-2.39 6.35A13.04 13.04 0 0 0 27.54 22zM9.23 12h-5.6A12.99 12.99 0 0 0 3 16a13 13 0 0 0 .63 4h5.6A33.06 33.06 0 0 1 9 16c0-1.38.08-2.72.24-4zm11.51 0h-9.48a30.45 30.45 0 0 0-.26 4c0 1.4.1 2.74.26 4h9.48c.17-1.26.26-2.6.26-4a30.31 30.31 0 0 0-.26-4zm7.63 0h-5.6a33.25 33.25 0 0 1 0 8h5.6a12.99 12.99 0 0 0 .63-4 13 13 0 0 0-.63-4zM11.94 3.65l-.05.01A13.04 13.04 0 0 0 4.46 10h5.1c.5-2.57 1.32-4.77 2.38-6.35zM16 3h-.13c-1.72.14-3.4 2.92-4.27 7h8.8c-.89-4.18-2.63-7-4.4-7zm4.06.65.04.05a17.74 17.74 0 0 1 2.35 6.3h5.09a13.04 13.04 0 0 0-7.48-6.35z',
  CASH: 'M25 4a2 2 0 0 1 2 1.85V8h2.04c1.04 0 1.88.82 1.96 1.85V26c0 1.05-.8 1.92-1.81 2H6.96a1.98 1.98 0 0 1-1.95-1.85L5 26v-2H3a2 2 0 0 1-2-1.85V6a2 2 0 0 1 1.85-2H3zm2 18a2 2 0 0 1-1.85 2H7v2h22V10h-2zM25 6H3v16h22zm-3 12a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-8-8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
  BUILDINGS:
    'M1448 4202 l-928 -155 0 -1874 0 -1873 -260 0 -260 0 0 -150 0 -150 2560 0 2560 0 0 150 0 150 -260 0 -260 0 0 1680 0 1680 -945 0 -945 0 0 -1680 0 -1680 -150 0 -150 0 0 2030 c0 1927 -1 2030 -17 2029 -10 -1 -435 -71 -945 -157z m542 -392 l0 -150 -160 0 -160 0 0 150 0 150 160 0 160 0 0 -150z m-732 -732 l3 -148 -161 0 -160 0 0 150 0 151 158 -3 157 -3 3 -147z m730 0 l3 -148 -161 0 -160 0 0 150 0 151 158 -3 157 -3 3 -147z m1462 2 l0 -150 -160 0 -160 0 0 143 c0 79 3 147 7 150 3 4 75 7 160 7 l153 0 0 -150z m730 0 l0 -150 -160 0 -160 0 0 143 c0 79 3 147 7 150 3 4 75 7 160 7 l153 0 0 -150z m-2922 -737 l-3 -148 -157 -3 -158 -3 0 151 0 150 160 0 161 0 -3 -147z m730 0 l-3 -148 -157 -3 -158 -3 0 151 0 150 160 0 161 0 -3 -147z m1462 -3 l0 -151 -157 3 -158 3 -3 148 -3 147 161 0 160 0 0 -150z m730 0 l0 -151 -157 3 -158 3 -3 148 -3 147 161 0 160 0 0 -150z m-2922 -727 l-3 -148 -157 -3 -158 -3 0 151 0 150 160 0 161 0 -3 -147z m732 -3 l0 -150 -160 0 -160 0 0 150 0 150 160 0 160 0 0 -150z m1460 0 l0 -150 -160 0 -160 0 0 150 0 150 160 0 160 0 0 -150z m730 0 l0 -151 -157 3 -158 3 -3 148 -3 147 161 0 160 0 0 -150z m-2200 -945 l0 -365 -150 0 -150 0 0 215 0 215 -215 0 -215 0 0 -215 0 -215 -150 0 -150 0 0 365 0 365 515 0 515 0 0 -365z m1470 215 l0 -150 -160 0 -160 0 0 150 0 150 160 0 160 0 0 -150z m730 0 l0 -150 -160 0 -160 0 0 150 0 150 160 0 160 0 0 -150z',
  NAVIGATION_ARROW:
    'M10.84 16.35c-.17.41-.61.72-1.05.64A1.04 1.04 0 0 1 9 16V9H1.94a.94.94 0 0 1-.36-1.8l13.1-5.12a.95.95 0 0 1 1.04.2c.28.27.36.67.2 1.03z',
  BELL: 'M6.83 20.55 7 20.3V13a9 9 0 1 1 18 0v7.3l.17.25 2.68 4.02a.92.92 0 0 1-.77 1.43H4.92a.92.92 0 0 1-.77-1.43zm6.18 5.82-.01.83a3 3 0 1 0 6 0l-.01-.77M16 1v3'
};

export default paths;
