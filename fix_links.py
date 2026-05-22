import os, re

# Ruta donde están tus archivos .md
base_path = "."

for filename in os.listdir(base_path):
    if filename.endswith(".md"):
        filepath = os.path.join(base_path, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Reemplazar URLs de Deepwiki por archivos .md locales
        new_content = re.sub(
            r"https://deepwiki\.com/Lourdes12587/Proyecto-Node\.js/\d+[-\w]*",
            lambda m: m.group(0).split("/")[-1].split("-")[-1].capitalize() + ".md",
            content
        )

        # Reemplazar rutas absolutas tipo /Proyecto-Node.js/... por rutas relativas
        new_content = re.sub(
            r"/Proyecto-Node\.js/\d+[-\w]*",
            lambda m: "./" + m.group(0).split("/")[-1] + ".md",
            new_content
        )

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)

print("✅ Enlaces actualizados correctamente.")
