#!/bin/bash

set -e

echo "📦 Installation des dépendances..."
npm install

echo "🏗️  Build du site..."
npm run build

echo "🧹 Nettoyage du dossier cible..."
rm -rf /opt/clairobscur/pictos-rec/*

echo "📁 Copie du site dans /opt/clairobscur/pictos-rec..."
cp -r ./dist/* /opt/clairobscur/pictos-rec/

echo "✅ Déploiement terminé !"
