# Jeu "Où est Charlie ?"

Ce projet est un jeu "Hidden Object" simple et responsive.

## 📁 Structure des fichiers

- **index.html** : La structure de la page.
- **styles.css** : Le design et les animations du jeu.
- **script.js** : La logique du jeu (chronomètre, clics, victoire).

## 🛠 Comment personnaliser le jeu

### 1. Changer l'image

1. Placez votre nouvelle image dans le dossier du projet ou hébergez-la en ligne.
2. Ouvrez `index.html`.
3. Cherchez la balise `<img>` avec l'id `game-image`.
4. Changez l'attribut `src` :
   ```html
   <img id="game-image" src="./mon-image.jpg" ...>
   ```

### 2. Configurer les Niveaux

Le fichier `script.js` contient une liste de niveaux. Vous pouvez en ajouter autant que vous voulez.

1.  **Obtenir les infos** (comme avant : Dimensions image + Coordonnées cible).
2.  **Mettre à jour `LEVELS`** dans `script.js` :

   ```javascript
   const LEVELS = [
       {
           id: 1,
           name: "Plage",
           imageSrc: "./images/plage.jpg",
           originalWidth: 1920,
           originalHeight: 1080,
           targetX: 500,
           targetY: 300,
           toleranceRadius: 50
       },
       {
           id: 2,
           name: "Ville",
           imageSrc: "./images/ville.jpg",
           originalWidth: 2000,
           originalHeight: 1500,
           targetX: 1200,
           targetY: 800,
           toleranceRadius: 50
       }
       // Ajoutez d'autres blocs ici...
   ];
   ```

### 3. Utiliser vos propres images (Local)

Pour utiliser des images stockées sur votre ordinateur :

1.  Ouvrez le dossier du projet et allez dans le dossier `images`.
2.  Copiez vos photos (ex: `ma-famille.jpg`) dans ce dossier.
3.  Dans `script.js`, utilisez le chemin relatif comme ceci :

   ```javascript
   {
       id: 3,
       name: "Ma Famille",
       imageSrc: "./images/ma-famille.jpg", // <--- C'est ici !
       originalWidth: 4032,
       originalHeight: 3024,
       targetX: 1200,
       targetY: 1500,
       toleranceRadius: 80
   }
   ``` 

**Astuce** : Assurez-vous que le nom du fichier correspond exactement (attention aux .jpg vs .jpeg vs .JPG).

### 4. Trouver les coordonnées facilement (Astuce Pro)

Pas besoin de Photoshop ! Le jeu contient un outil intégré :

1.  Lancez le jeu dans votre navigateur.
2.  Ouvrez la **Console** (F12 ou Clic Droit > Inspecter > Console).
3.  Cliquez sur l'endroit où se trouve Charlie (ou votre cible).
4.  Regardez dans la console, le jeu vous donnera les valeurs exactes à copier :
    `📍 Clic détecté ! Pour votre config : targetX: 1234, targetY: 567`
5.  Recopiez ces valeurs dans votre fichier `script.js`.

## 🎮 Comment jouer

1. Le jeu commence au Niveau 1.
2. Trouvez la cible pour passer au niveau suivant.
3. À la fin, vous pourrez recommencer.
