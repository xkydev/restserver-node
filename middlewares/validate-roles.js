

const validateRoles = (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: "Can't varify the role - Token not validated",
        });
    }

    const { role, name } = req.user;

    if (role !== "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `${name} is not an admin`
        })
    }

    next();
}

const haveRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: "Can't varify the role - Token not validated",
            });
        }

        const { role } = req.user;

        if (!roles.includes(role)) {
            return res.status(401).json({
                msg: `You don't have any of this roles ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    validateRoles,
    haveRole
};