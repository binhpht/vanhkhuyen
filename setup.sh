COURSE=bru-course

# Detect the web app folder
if [[ -d apps/webapp ]]; then APP=apps/webapp;
elif [[ -d apps/web ]]; then APP=apps/web;
else echo "❌ No apps/webapp or apps/web found"; exit 1; fi

DEST="$APP/src/courses/$COURSE"
mkdir -p "$DEST"

python - <<PY
from librelingo_yaml_loader import load_course
from librelingo_json_export.export import export_course

course = load_course("./courses/$COURSE")
export_course("./$DEST", course)

print("✅ Exported to:", "$DEST")
PY

# quick check
ls -R "$DEST" | sed 's/^/   /'

