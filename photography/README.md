# Adding photographs through GitHub

1. In your GitHub repository, create the folder `photography/images`.
2. Upload your image files there (JPG, PNG, or WebP work well).
3. In `photography/gallery.json`, add one entry per photograph. Use the image's repository path for `src`, for example:

   ```json
   {"src":"photography/images/varanasi-morning.jpg","alt":"Morning light on the ghats","caption":"Varanasi · 2026"}
   ```
4. Commit and publish. The gallery page reads the list automatically.

Keep image files around 2000px on their longest edge and below 1 MB where practical for a fast gallery.
