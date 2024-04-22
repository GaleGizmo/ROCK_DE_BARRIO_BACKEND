const User = require("../api/usuario/usuario.model");
const { verifyJwt } = require("../utils/jwt");
const Comentario = require("../api/comentario/comentario.model");
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Debes estar logueado, chaval" });
    }
    const parsedToken = token.replace("Bearer ", "");

    const validToken = verifyJwt(parsedToken);
    const userLogued = await User.findById(validToken.id).select("-password");
    if (!userLogued) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    req.user = userLogued;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Debes estar logueado, chaval" });
    }
    const parsedToken = token.replace("Bearer ", "");

    const validToken = verifyJwt(parsedToken);
    const userLogued = await User.findById(validToken.id);
    if (!userLogued) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    if (userLogued.role === 2) {
      userLogued.password = null;
      req.user = userLogued;
      next();
    } else
      return res
        .status(403)
        .json({ message: "No estás autorizado para esta función, chavalote" });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
const isAdminOrOwner = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Debes estar logueado, chaval" });
    }
    const parsedToken = token.replace("Bearer ", "");
    const validToken = verifyJwt(parsedToken);
    const userLogued = await User.findById(validToken.id);
    if (!userLogued) {
      return res.status(404).json({ message: "Usuario non encontrado" });
    }
    const { idUsuario } = req.params;

    // Comprueba si el usuario logueado es un admin o el propietario
    if (userLogued.role === 2 || userLogued.id === idUsuario) {
      userLogued.password = null;
      req.user = userLogued;
      next();
    } else {
      return res
        .status(403)
        .json({ message: "No estás autorizado para esta función, chavalote" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
const isAdminOrComentarioOwner = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Debes estar logueado, chaval" });
    }
    const parsedToken = token.replace("Bearer ", "");
    const validToken = verifyJwt(parsedToken);
    const userLogued = await User.findById(validToken.id);
    if (!userLogued) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    const { idComentario } = req.params;
    const comentario = await Comentario.findById(idComentario);
    if (!comentario) {
      return res.status(401).json({ message: "Comentario no encontrado" });
    }
    if (
      userLogued.role === 2 ||
      comentario.user.toString() === userLogued.id.toString()
    ) {
      userLogued.password = null;
      req.user = userLogued;
      next();
    } else {
      return res
        .status(403)
        .json({ message: "No estás autorizado para esta función, chavalote" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// const authenticate = async (req, res, next) => {
//   const token = req.headers.authorization;
//   if (!token) {
//     return res.status(401).json({ message: "Debes estar logueado, rapaz" });
//   }
//   const parsedToken = token.replace("Bearer ", "");
//   const validToken = verifyJwt(parsedToken);
//   const userLogued = await User.findById(validToken.id).select("-password");
//   if (!userLogued) {
//     return res.status(401).json({ message: "Usuario non atopado" });
//   }
//   req.user = userLogued;
//   next();
// };

// const isAdmin = [authenticate, (req, res, next) => {
//   if (req.user.role === 2) {
//     next();
//   } else {
//     return res.status(403).json({message: "Non estás autorizado para esta función"});
//   }
// }];

// const isAdminOrOwner = [authenticate, (req, res, next) => {
//   const { idUsuario } = req.params;
//   if (req.user.role === 2 || req.user.id === idUsuario) {
//     next();
//   } else {
//     return res.status(403).json({message: "Non estás autorizado para esta función"});
//   }
// }];

// const isAdminOrComentarioOwner = [authenticate, async (req, res, next) => {
//   const { idComentario } = req.params;
//   const comentario = await Comentario.findById(idComentario);
//   if (!comentario) {
//     return res.status(401).json({ message: "Comentario non atopado" });
//   }
//   if (req.user.role === 2 || comentario.user.toString() === req.user.id.toString()) {
//     next();
//   } else {
//     return res.status(403).json({message: "Non estás autorizado para esta función"});
//   }
// }];

module.exports = {
  authenticate,
  isAdmin,
  isAdminOrOwner,
  isAdminOrComentarioOwner,
};
