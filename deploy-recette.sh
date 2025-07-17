#!/bin/bash
set -e

echo "📦 Installation des dépendances..."
npm install

echo "🏗️  Build du site..."
npm run build

echo "🔍 Vérification du dossier dist/"
if [ ! -d "dist" ]; then
  echo "❌ Le dossier 'dist/' n'a pas été généré. Abandon du déploiement."
  exit 1
fi

echo "🧹 Nettoyage du dossier cible..."
rm -rf /opt/clairobscur/pictos-rec/*

echo "📁 Copie des fichiers du build dans /opt/clairobscur/pictos-rec..."
cp -r dist/* /opt/clairobscur/pictos-rec/

echo "✅ Déploiement terminé avec succès !"
