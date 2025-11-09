
rt bru-course into the web app
COURSE=bru-course
if [[ -d packages/librelingo-web/src/courses ]]; then APP=packages/librelingo-web;
elif [[ -d apps/webapp/src/courses ]]; then APP=apps/webapp;
elif [[ -d apps/web/src/courses ]]; then APP=apps/web;
else echo "❌ Can't find web app (packages/librelingo-web|apps/webapp|apps/web)"; exit 1; fi

DEST="$APP/src/courses/$COURSE"
mkdir -p "$DEST"

python - <<PY
from librelingo_yaml_loader import load_course
from librelingo_json_export.export import export_course
course = load_course("./courses/$COURSE")
export_course("./$DEST", course)
print("✅ Exported to:", "$DEST")
PY

# 2) Start the dev server (workspace script)
npm run web-dev

