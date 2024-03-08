import { Project } from "@app/modeles/database/project";
import { db, scriptBootstrap } from "../bootstrap";
import { User } from "@app/modeles/database/user"
import { FirestoreHelper } from "@app/utils/firebase/firestore-helper";
import { ECollections } from "@app/utils/firebase/firestore-collections";
import { Organization } from "@app/modeles/database/organization";
import { ERoles } from "@app/modeles/roles";
import  {AdminProjectManager} from '@app/manager/admin/project-manager.admin'

import { CreateRequest, getAuth } from "firebase-admin/auth";
import { AdminUserManager } from "@app/manager/admin/user.manager.admin";

scriptBootstrap()

if (!db) {
    throw 'db not init'
}

let helper = new FirestoreHelper()

async  function createUserOrganizationOnProject():Promise<Project>{
    
    let user: User = {
        email: "user1@test.com",
        name: "user1",
        role: ERoles.USER
    }

    let userBlob: CreateRequest = {
        email: user.email,
        emailVerified: true,
        password: "coucou",
        displayName: user.name,
        disabled: false
    }
    
    if(!db){
        throw "db null"
    }

    let organizationUser: User = {
        email: "organization@test.com",
        name: "organization-user",
        role: ERoles.ORGANIZATION_ADMIN
    }

    let blobOrganization: CreateRequest = {
        email: organizationUser.email,
        emailVerified: true,
        password: "coucou",
        displayName: organizationUser.name,
        disabled: false
    }
    

       
    let um = new AdminUserManager()
    await um.createUser(blobOrganization, ERoles.ORGANIZATION_ADMIN)
    organizationUser.id = um.userId
    await um.createUser(userBlob, ERoles.USER)
    user.id = um.userId

    
  
    
    if (!user.id && !organizationUser.id) throw 'user or orga are null'
    
    // ADD USER AND FAMILY USER
    let project: Project = {
        name: "project",
        owners: {
            owner_ids: [user.id, organizationUser.id],
            users: [
                {
                    user_id: organizationUser.id,
                    user_name: organizationUser.name,
                    user_role: ERoles.ORGANIZATION_ADMIN
                },
                {
                    user_id: user.id,
                    user_name: user.name,
                    user_role: ERoles.USER
                }
            ]
        }
    }
    
    await helper.createNewDocument(db, ECollections.PROJECTS, project)
    
    if (!project.id) throw 'project null'
    let orga: Organization = {
        name: "Organization"
    }
    
    await helper.createNewDocument(db, ECollections.ORGANIZATION, orga)
    
    project.owners.organisation_id = orga.id
    project.owners.organisation_name = orga.name
    await helper.updateDocument(db, "project", project.id, project)
    
    console.log("created user=", user, "project=", project, "orga=", orga)
    
    return project
    
}





let p = await createUserOrganizationOnProject()

async function createFamilyUser():Promise<User>{
    let familyUser: User = {
        email: "family@test.com",
        name: "family-user",
        role: ERoles.FAMILY
    }
    let blob: CreateRequest = {
        email: familyUser.email,
        emailVerified: true,
        password: "coucou",
        displayName: familyUser.name,
        disabled: false
    }
    
    let um = new AdminUserManager()
    await um.createUser(blob, ERoles.FAMILY)
    familyUser.id = um.userId
    
    console.log("USER CREATE BY ADMIN", um.userId)
    return familyUser
}

async function createBiographerUser():Promise<User>{
    let biographerUser: User = {
        email: "biographer@test.com",
        name: "biographer1",
        role: ERoles.BIOGRAPHER
    }
    let blob: CreateRequest = {
        email: biographerUser.email,
        emailVerified: true,
        password: "coucou",
        displayName: biographerUser.name,
        disabled: false
    }
    
    let um = new AdminUserManager()
    await um.createUser(blob, ERoles.BIOGRAPHER)
    biographerUser.id = um.userId
    
    console.log("BIOGRAPHER CREATED BY ADMIN", um.userId)
    return biographerUser
}

let familyUser = await createFamilyUser()
let biographerUser = await createBiographerUser()


if(p.id){
    new AdminProjectManager().addUserOnProject(familyUser, p.id)
    new AdminProjectManager().addUserOnProject(biographerUser, p.id)
}else{
    console.error("project does not exists")
}








