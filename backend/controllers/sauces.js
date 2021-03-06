const Sauce = require('../models/Sauce');
const fs = require('fs');


/*******************************************Crée sauce****************************************************/

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

/*******************************************Modification sauce*********************************************/

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  //delete old image if changing image
  if (req.file !== undefined) {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          console.log("L'image d'origine a bien été supprimée");
        });
      })
      .catch(error => res.status(500).json({ error }));
  };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

/*******************************************Supprimé sauce****************************************************/

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

/*******************************************get one sauce****************************************************/

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

/*******************************************get all sauce****************************************************/

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

/*******************************************Like Dislike****************************************************/

exports.likeOrDislikeSauce = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const likes = req.body.like;
    const id = req.params.id;
    const sauce = await Sauce.findById(id);

    switch (likes) { //évalue une expression et, selon le résultat obtenu et le 'cas' associé, exécute les instructions correspondantes.
      case 1: // cas si like=1
        try {
          if (!sauce.usersLiked.includes(userId)) {//vérifier si l'utilisateur est déjà dans le tableau usersLiked
            await Sauce.findByIdAndUpdate(id, { $inc: { likes: 1 }, $push: { usersLiked: userId } }) // incrémenter like et push l'utilisateur dans []usersLiked
            res.status(201).json({ message: 'vous avez aimé cette sauce !' })
          }
        } catch (error) {
          res.status(400).json({ error })
        }
        break;//L'instruction break permet de terminer la boucle en cours ou l'instruction switch ou label en cours et de passer le contrôle du programme à l'instruction suivant l'instruction terminée.

      case 0: // cas si like =0
        try {
          if (sauce.usersLiked.includes(userId)) { // si l'utilisateur est déjà dans userLiked , décrémentez like et extrayez l'utilisateur du tableau
            await Sauce.findByIdAndUpdate(id, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
            res.status(201).json({ message: 'Like retiré !' })
            break;
          } else if (sauce.usersDisliked.includes(userId)) {  // si l'utilisateur est déjà dans userDisliked , décrémentez dislike et extrayez l'utilisateur du tableau

            await Sauce.findByIdAndUpdate(id, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
            res.status(201).json({ message: 'Dislike retiré !' })
          }

        } catch (error) {
          res.status(400).json({ error })
        }

        break;

      case -1: //cas si like =-1
        try {
          if (!sauce.usersDisliked.includes(userId)) { // vérifier si l'utilisateur est déjà dans []usersDisliked
            await Sauce.findByIdAndUpdate(id, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } }) // incrémente dislike et push l'utilisateur dans []usersDisliked
            res.status(201).json({ message: "Vous n'avez pas aimé cette sauce !" })

          }

        } catch (error) {
          res.status(400).json({ error })
        }
        break;

      default: break;
    }


  } catch (error) {
    res.status(400).json({ error });
  };
};