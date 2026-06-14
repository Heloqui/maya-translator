/**
 * Affiliate link builder for Maya Glyphs.
 * Uses the same Awin publisher ID and merchant IDs as divewindow.app.
 */

const AWIN_PUBLISHER_ID = '2868363'
const AWIN_BOOKING_MID = '617538'

export function bookingLink(destination, clickref = 'maya_site') {
  const target = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`
  return `https://www.awin1.com/cread.php?awinmid=${AWIN_BOOKING_MID}&awinaffid=${AWIN_PUBLISHER_ID}&clickref=${clickref}&p=${encodeURIComponent(target)}`
}

export function getYourGuideLink(query) {
  return `https://www.getyourguide.com/s/?q=${encodeURIComponent(query)}`
}

export function airaloLink() {
  return 'https://www.airalo.com/?ref=HECTOR0416'
}
