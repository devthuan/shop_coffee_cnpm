import { Accounts } from "src/auth/entities/accounts.entity";
import { BaseEntity } from "src/common/base.entity";
import { ProductAttributeValue } from "src/product/entities/product_attribute_values.entity";
import { SubAttributes } from "src/sub-attribute/entities/sub-attribute.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({name: "cart"})
export class Cart extends BaseEntity {
    
    @Column()
    quantity: number

    @ManyToOne(() => Accounts, accounts => accounts.cart)
    accounts: Accounts;

    @ManyToOne(() => ProductAttributeValue, productAttributeValue => productAttributeValue.cart)
    productAttributeValue: ProductAttributeValue;

}
