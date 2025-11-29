# verify_site.sh
echo "Verifying Landing Page..."
curl -s http://localhost:5000/ | grep "<title>" || echo "Landing Title Missing"

echo "Verifying App Route..."
curl -s http://localhost:5000/app | head -n 20 || echo "App Route Failed"

echo "Verifying SEO Meta Tags..."
curl -s http://localhost:5000/ | grep 'name="description"' || echo "Meta Description Missing"
curl -s http://localhost:5000/ | grep 'property="og:title"' || echo "OG Title Missing"
