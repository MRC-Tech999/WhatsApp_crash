#!/bin/bash

# Définir la tête de mort en ASCII avec "YAMA FAMILY"
skull="
     _______
    /       \\
   |  O   O  |
   |    ^    |
   |   '-'   |
    \_______/
"
yama="YAMA FAMILY YAMA FAMILY YAMA FAMILY YAMA FAMILY YAMA FAMILY YAMA FAMILY YAMA FAMILY"

# Affichage continu de "YAMA FAMILY" et de la tête de mort en ASCII
while true; do
  clear
  echo "$skull"
  echo -e "\e[1;37;41m $yama \e[0m"  # Texte en rouge sur fond blanc
  sleep 1
done &

# Prévenir l'utilisateur que l'exécution est en cours
echo "YAMA FAMILY TEST EN COURS"
echo "Appuyez sur BACK ou CTRL+C ne fonctionne pas"

# Blocage pendant 30 minutes
sleep 5800  # Attente de 30 minutes (1800 secondes)

# Geler le téléphone après 30 minutes
echo "30 minutes sont passées... Le téléphone va maintenant devenir lent."
echo "YAMA FAMILY"

# Boucle infinie pour continuer à solliciter le CPU
while true; do
  sleep 1  # Le script fait tourner le processeur
done
