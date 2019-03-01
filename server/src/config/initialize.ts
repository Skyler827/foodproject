import {getManager} from "typeorm";
import {User, UserType} from  "../entities/user";

export async function initialize() {
    const entityManager = getManager();
    const users:User[] = await entityManager.find(User);
    users.forEach(u => entityManager.delete(User, u.id));
    const u: User = new User('skyler', UserType.Server, 'skyler');
    entityManager.save(u);
}