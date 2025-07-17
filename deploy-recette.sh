#!/bin/bash
set -e

echo "📦 Installation des dépendances..."
npm install

echo "🏗️  (Pas de build nécessaire pour ce projet statique)"

echo "🧹 Nettoyage du dossier cible..."
rm -rf /opt/clairobscur/pictos-rec/*

echo "📁 Copie des fichiers du site dans /opt/clairobscur/pictos-rec..."
cp -r index.html css/ js/ data/ /opt/clairobscur/pictos-rec/

echo "✅ Déploiement terminé !"
