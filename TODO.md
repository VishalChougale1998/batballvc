# downloadTeamPDF not working - Analysis

**Root Cause:**
- Invalid logo path `/src/Media/logo.jpeg` in `pdf.addImage()` (404 error)
- src/Media/ not public accessible
- Sync function - no image load handling

**Why other PDF works:** exportPDF uses async `toDataURL(fetch())`

**To fix (when ready):**
1. Copy `src/Media/logo.jpeg` → `public/Media/logo.jpeg`
2. Update `logoUrl = "/Media/logo.jpeg"`
3. Make async + error handling

Function now identified - check browser console for exact error when clicking "PDF with Logo".
