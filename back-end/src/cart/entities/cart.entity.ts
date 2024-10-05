import { Accounts } from "src/auth/entities/accounts.entity";
import { BaseEntity } from "src/common/base.entity";
import { ProductAttributes } from "src/product/entities/productAttributes.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({name: "cart"})
export class Cart extends BaseEntity {
    
    @Column()
    quantity: number

    @ManyToOne(() => Accounts, accounts => accounts.cart)
    accounts: Accounts;

    @ManyToOne(() => ProductAttributes, productAttributes => productAttributes.cart)
    productAttributes: ProductAttributes;

}
