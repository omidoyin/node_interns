

module.exports =(sequelize,DataTypes)=>{

    const orders= sequelize.define("orders",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false
        },
        product_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        total:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        stripe_id:{
            type:DataTypes.STRING,
            allowNull:false
        },
        status:{
            type:DataTypes.ENUM,
            values:["failed", "paid"],
            defaultValues:"failed"
        }
    })

    return orders
}